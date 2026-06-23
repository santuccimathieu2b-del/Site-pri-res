import React from "react";
import { ScrollText, Flame, BookOpen, HandHelping } from "lucide-react";

const Pratique = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-20" data-testid="pratique-page">
      <p className="font-engraved text-[var(--gold)] text-[11px] mb-4">Conseils du panseur</p>
      <h1 className="font-serif-display text-5xl md:text-6xl text-[var(--ivory)] leading-tight">
        <em className="text-[var(--gold)]">Pratique</em> et conseils
      </h1>

      <div className="divider-ornament my-12"><Flame size={14} strokeWidth={1.2} /></div>

      {/* Section 1 */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-[var(--gold)]" strokeWidth={1.1} size={24} />
          <h2 className="font-serif-display text-3xl text-[var(--ivory)]">Utilisation des prières</h2>
        </div>
        <div className="font-serif-body text-[var(--ivory-muted)] text-lg leading-loose space-y-5">
          <p>
            En raison du caractère très ancien de la plupart des prières, elles sont souvent adressées à Dieu, Jésus,
            Marie ou des Saints.
          </p>
          <p>
            La plupart des prières ne sont utilisées que pour une seule maladie mais certaines ont ce pouvoir de
            soulager plusieurs maux.
          </p>
          <p>
            On parle souvent de « don ». Je demeure assez sceptique sur le bien-fondé de ce mot car cela voudrait dire
            que certains d'entre nous ont reçu le don de soulager son prochain et d'autres n'en ont pas le droit.
          </p>
          <p>
            Aussi, à mon humble avis, le don vient bien plus de connaître les formules et les utiliser que de
            s'autoproclamer « porteur d'un don ».
          </p>
          <div className="sacred-card sharp p-5 border-l-4 border-l-[var(--gold)] my-6">
            <p className="text-sm">
              <span className="font-engraved text-[var(--gold)] text-[10px] mr-2">Rappel :</span>
              Les prières et rituels présentés sur ce site ne constituent ni un avis médical ni une alternative à un
              suivi professionnel. Pour toute question concernant votre santé physique ou mentale, consultez un
              professionnel de santé.
            </p>
          </div>
          <p>
            La pratique se fait en face de la personne à soulager mais certains pratiquent par téléphone ou par photo.
            Il semblerait même que certains hôpitaux aient déjà fait appel à des coupeurs de feu.
          </p>
          <p>
            Je ne pratique pas à distance car je suis mal à l'aise avec le principe mais cela ne veut pas dire que ça
            ne fonctionne pas. À vous de tester.
          </p>
        </div>
      </section>

      <div className="divider-ornament my-12"><ScrollText size={14} strokeWidth={1.2} /></div>

      {/* Section 2 */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <HandHelping className="text-[var(--gold)]" strokeWidth={1.1} size={24} />
          <h2 className="font-serif-display text-3xl text-[var(--ivory)]">Se faire payer ?</h2>
        </div>
        <div className="font-serif-body text-[var(--ivory-muted)] text-lg leading-loose space-y-5">
          <p>
            Autre chose importante : que ce soit pour soulager des maux de dents, de tête, des brûlures ou quoi que ce
            soit d'autre, je vous conseille vivement de <em className="text-[var(--ivory)]">ne pas vous faire payer</em>.
            L'utilisation des prières se fait pour aider son prochain et non pour gagner de l'argent.
          </p>
          <p>
            Certains « panseurs » font payer leur prestation mais c'est souvent dû au fait qu'ils proposent d'autres
            prestations que de simples soulagements. Pour ceux qui font payer une simple coupure de feu, que bien leur
            en fasse…
          </p>
          <p>
            En revanche, vous pouvez accepter des dons (argent, nourriture, un service…), mais sans demander. Uniquement
            si on vous le propose.
          </p>
          <p>
            Néanmoins, une chose est vraie : le fait de payer encourage le patient à s'investir dans la démarche et donc
            à accélérer son propre soulagement.
          </p>
          <p>
            Je vous laisse donc maitre de choisir de faire payer ou pas. Mais je vous encourage très vivement à
            n'accepter que des dons car, que l'on vous paye ou pas, tout le monde a le droit à votre aide. À vous de
            voir…
          </p>
          <div className="sacred-card sharp p-6 mt-8">
            <p className="font-engraved text-[var(--gold)] text-[10px] mb-3">Pourquoi ce site est-il payant ?</p>
            <p className="text-base">
              La réponse est simple : les prières de soins sont toutes <em className="text-[var(--gold)]">gratuites</em>.
            </p>
            <p className="text-base mt-3">
              Pour déverrouiller l'ensemble du site, cela devient payant car les autres prières sont beaucoup plus
              complexes, voire même dangereuses pour certaines, si elles ne sont pas utilisées avec précaution et par
              quelqu'un formé pour. Elles ont demandé un véritable travail de recherche et de traduction car les
              versions originales sont pour la plupart en latin. Pour certaines, elles sont interdites à la pratique
              car réservées aux prêtres exorcistes de l'Église catholique romaine. Elles ne sont là qu'à titre purement
              informatif.
            </p>
          </div>
        </div>
      </section>

      <div className="divider-ornament my-12"><Flame size={14} strokeWidth={1.2} /></div>

      {/* Section 3 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <ScrollText className="text-[var(--gold)]" strokeWidth={1.1} size={24} />
          <h2 className="font-serif-display text-3xl text-[var(--ivory)]">Comment utiliser les prières</h2>
        </div>
        <p className="font-serif-body text-[var(--ivory-muted)] text-lg leading-loose mb-8">
          Il n'y a pas de mode d'emploi mais juste des impératifs :
        </p>

        <ul className="space-y-5">
          {[
            "Le principal est l'intention que vous mettez dans votre pratique. Vous utilisez une prière avec la réelle envie d'aider et de soulager.",
            "Vous devez être convaincu que ça ne peut que marcher.",
            "Vous avez une confiance totale et absolue dans la prière que vous avez choisie (même si vous n'êtes pas pratiquant).",
            "Apprenez les prières par cœur pour éviter de « bloquer » lors de leur utilisation ; ça risquerait de vous déconcentrer et de vous faire perdre confiance.",
            "Fixez l'endroit de la douleur en récitant la prière avec l'intention de la soulager.",
            "Si la prière est trop longue, lisez-la, mais ce n'est pas l'idéal pour pouvoir garder les yeux sur l'endroit à soulager.",
            <>Vous devrez utiliser des signes de croix (à chaque fois que vous rencontrerez le signe <span className="text-[var(--gold)]">†</span>) même si vous n'êtes pas croyant : faites-le avec conviction.</>,
          ].map((txt, i) => (
            <li key={i} className="flex gap-5 items-start" data-testid={`impératif-${i}`}>
              <span className="font-serif-display text-3xl text-[var(--gold)] leading-none mt-1">{i + 1}</span>
              <p className="font-serif-body text-[var(--ivory)] text-lg leading-relaxed flex-1">{txt}</p>
            </li>
          ))}
        </ul>

        <p className="font-serif-display italic text-2xl text-[var(--gold)] text-center mt-16">
          Voilà ! C'est à vous !
        </p>
        <div className="divider-ornament mt-10"><Flame size={14} strokeWidth={1.2} /></div>
      </section>
    </div>
  );
};

export default Pratique;
