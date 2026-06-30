"""Restore prayers from backup JSON file into MongoDB.

Usage:
    python -m backend.scripts.restore_prayers           # interactive (asks confirmation)
    python -m backend.scripts.restore_prayers --force   # silently restore missing prayers
    python -m backend.scripts.restore_prayers --replace # WIPE prayers collection then restore all

The script reads /app/backend/data/prayers_backup.json (committed in the repo)
and re-inserts any prayer whose `id` is not yet present in the database.

This guarantees that even if the MongoDB instance is wiped, the full prayer
library can be restored from the file checked into Git.
"""
from __future__ import annotations
import argparse
import asyncio
import json
import os
from pathlib import Path

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parent.parent
BACKUP_FILE = BACKEND_DIR / "data" / "prayers_backup.json"


async def restore(force: bool, replace: bool) -> None:
    load_dotenv(BACKEND_DIR / ".env")
    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ["DB_NAME"]
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    with BACKUP_FILE.open("r", encoding="utf-8") as f:
        backup = json.load(f)

    prayers = backup["prayers"]
    print(f"Backup exported_at : {backup.get('exported_at')}")
    print(f"Prayers in backup  : {len(prayers)}")

    if replace:
        if not force:
            answer = input("WIPE existing prayers collection and replace? type 'yes' to confirm: ")
            if answer.strip().lower() != "yes":
                print("Aborted.")
                return
        await db.prayers.delete_many({})
        if prayers:
            await db.prayers.insert_many(prayers)
        print(f"Replaced. Total now: {await db.prayers.count_documents({})}")
        return

    inserted = 0
    skipped = 0
    for p in prayers:
        existing = await db.prayers.find_one({"id": p["id"]})
        if existing:
            skipped += 1
            continue
        await db.prayers.insert_one(p)
        inserted += 1

    total = await db.prayers.count_documents({})
    print(f"Inserted: {inserted} | Already present: {skipped} | Total in DB: {total}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Restore prayers from JSON backup")
    parser.add_argument("--force", action="store_true", help="Skip confirmation prompt")
    parser.add_argument("--replace", action="store_true", help="Wipe collection and reinsert all")
    args = parser.parse_args()
    asyncio.run(restore(force=args.force, replace=args.replace))


if __name__ == "__main__":
    main()
