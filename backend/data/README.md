# Sauvegarde et restauration des prières

Ce dossier contient une **copie de sauvegarde** de toutes les prières du site, exportées depuis MongoDB et versionnées dans Git/GitHub.

## Fichiers

- `prayers_backup.json` — Export complet de la collection `prayers` (titre, contenu, catégorie, etc.). Mis à jour manuellement par l'agent quand de nouvelles prières sont ajoutées.

## Restauration

Si la base de données venait à être vidée (changement d'environnement, déploiement, incident), il suffit d'exécuter :

```bash
# Restaure uniquement les prières manquantes (idempotent)
python -m backend.scripts.restore_prayers --force

# OU : Remplace intégralement le contenu actuel par le backup
python -m backend.scripts.restore_prayers --replace --force
```

Le script lit `prayers_backup.json` et ré-insère dans MongoDB toutes les prières dont l'`id` n'est pas déjà présent.
