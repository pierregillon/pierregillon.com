import type { Metadata } from "next";
import { ArrowDownIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { SectionTitle } from "@/components/section-title";
import { CtaSection } from "@/components/sections/cta-section";
import { FeatureSection } from "@/components/sections/feature-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mon offre",
};

export default function OfferPage() {
  return (
    <>
      <ProblemsSection />
      <FrustrationsSection />
      <ReassuranceSection />

      <FeatureSection
        tinted
        lead="Des développeurs concentrés sur la technique ?"
        accent="Je vous aide à construire un produit."
        image={{ src: "/images/themes/post-it-board.webp", alt: "Tableau couvert de post-it" }}
      >
        <p>
          Mon objectif : construire <u>un produit utile à forte valeur ajoutée</u>.
        </p>
        <p>
          Le codage n’est qu’un moyen pour atteindre un but plus grand : faire un produit qui a de l’
          <strong>impact pour vos utilisateurs</strong> et qui permet de créer du business.
        </p>
        <p>
          Je vous aide à travers différents ateliers d’intelligence collective à{" "}
          <strong>explorer le problème à résoudre, concevoir une solution simple,</strong> et{" "}
          <strong>prioriser</strong> les fonctionnalités qui ont <strong>le plus de valeur </strong>pour vous et vos
          utilisateurs.
        </p>
        <p>
          Avec pragmatisme, je ne développe aucune fonctionnalité à faible valeur ajoutée, inutile ou non pertinente
          pour votre business.
        </p>
      </FeatureSection>

      <FeatureSection
        reverse
        lead="Une application truffée de bugs ?"
        accent="Je mets en place de la qualité logicielle."
        image={{ src: "/images/themes/monitor-with-code.webp", alt: "Écran affichant du code" }}
      >
        <p>
          Je développe un <strong>produit de qualité</strong> : à la fois <strong>robuste</strong> et{" "}
          <strong>évolutif</strong>.
        </p>
        <p>
          Pour ce faire, je travaille avec les meilleurs standards de l’industrie du logiciel :{" "}
          <strong>Clean architecture</strong>, <strong>Clean code</strong>, <strong>Testabilité</strong>,{" "}
          <strong>Domain Driven Design</strong>, <strong>TDD.</strong>
        </p>
        <p>
          Cependant, je reste <strong>pragmatique</strong> sur ce qu’il faut mettre en place et à quel moment :{" "}
          <strong>la vérité business à toujours le dernier mot sur la technique</strong>.
        </p>
        <p>Le résultat :</p>
        <ul>
          <li>
            objectif <strong>0 bug</strong>
          </li>
          <li>
            une <strong>facilité constante</strong> pour ajouter de nouvelles fonctionnalités
          </li>
        </ul>
      </FeatureSection>

      <FeatureSection
        tinted
        lead="Des semaines pour avoir de nouvelles évolutions ?"
        accent="Je livre les fonctionnalités quotidiennement."
        image={{ src: "/images/themes/conveyor-belt-with-packages.webp", alt: "Tapis roulant transportant des colis" }}
      >
        <p>
          Mon objectif : obtenir des retours utilisateurs <u>le plus tôt possible</u> afin d’adapter le produit.
        </p>
        <p>
          Je travaille en <strong>livraison continue</strong>, c’est à dire qu’à chaque fois qu’
          <strong>une fonctionnalité</strong> est prête à être utilisée, je la déploie{" "}
          <strong>instantanément en production.</strong>
        </p>
        <p>
          Grâce aux tests automatisés, je m’assure que ces livraisons successives se passent de{" "}
          <strong>manière fluide et transparente</strong> pour l’utilisateur.
        </p>
        <p>
          Il est primordial de récolter les feedbacks <strong>le plus tôt possible</strong> afin de mesurer leur
          adoption, les ajuster et prioriser les fonctionnalités suivantes.
        </p>
        <p>Vous verrez chaque jour votre produit évoluer sous vos yeux.</p>
      </FeatureSection>

      <FeatureSection
        reverse
        lead="Aucune compétence ? Pas de soucis,"
        accent="je m'occupe de tout."
        image={{ src: "/images/themes/tool-box.webp", alt: "Boîte à outils bien rangée" }}
        className="max-w-[1000px] gap-5"
        textClassName="md:flex-[0_1_100%] md:self-stretch"
        imageClassName="md:flex-[1_1.3_auto]"
      >
        <p>
          Mon objectif : vous permettre de vous <u>concentrer sur votre coeur de métier</u>.
        </p>
        <p>
          Je développe <strong>tous les aspects techniques du produit</strong> : gestion du product backlog,
          prototyping, codage des fonctionnalités, mise en place de l’infrastructure cloud, CI/CD, monitoring.
        </p>
        <p>Vous aurez un interlocuteur unique.</p>
        <p>
          <strong>Je ne réinvente pas la roue</strong> : tout ce que je mets en place fait partie des standards de
          l’industrie. N’importe quel spécialiste pourra poursuivre mon travail.
        </p>
      </FeatureSection>

      <FeatureSection
        tinted
        lead="Le développement coûte cher ?"
        accent="Vous ne facturerez qu'une seule personne."
        image={{ src: "/images/themes/piggy-bank.webp", alt: "Tirelire posée sur des pièces de monnaie" }}
        className="gap-5"
        textClassName="md:flex-[0_1_100%] md:self-stretch"
      >
        <p>
          Mon objectif : vous faire <u>économiser de l’argent</u> avec un bien meilleur rapport qualité / prix.
        </p>
        <p>
          Pour la plupart des projets, une Entreprise de Service Numérique (ESN) standard vous fournira au minimum :
        </p>
        <ul>
          <li>
            <strong>2 à 3 développeurs</strong>
          </li>
          <li>
            <strong>1 Product Owner</strong>
          </li>
          <li>
            <strong>1 Infra</strong>
          </li>
          <li>
            <strong>1 UX designer</strong>
          </li>
        </ul>
        <p>
          Même si certains profils ne travailleront que quelques jours par semaines, le budget pour 6 mois de projet
          sera environ de 250 000 €.
        </p>
        <p>De mon côté, je m’occupe en autonomie de tous les aspects du développement.</p>
        <p>
          Vous ne facturerez qu’un seul profil : <strong>le mien</strong>, et mon tarif sera bien en dessous de la
          somme facturée par une ESN.
        </p>
      </FeatureSection>

      <FeatureSection
        reverse
        lead="Un produit générique qui ne répond pas à vos besoins ?"
        accent="Je construis un produit sur mesure."
        image={{ src: "/images/themes/sewing-mannequin.webp", alt: "Mannequin de couture portant une veste sur mesure" }}
        textClassName="md:flex-[0_1_100%] md:self-stretch"
      >
        <p>
          Mon objectif : développer<u> exactement ce dont vous avez besoin</u>, sans contraintes techniques.
        </p>
        <p>
          Je construits <strong>un produit sur mesure</strong> et adapté <strong>spécifiquement au problème</strong>{" "}
          que vous cherchez à résoudre.
        </p>
        <p>
          Vous avez <strong>une liberté totale sur la direction produit</strong> que vous souhaitez prendre.
        </p>
        <p>
          Avec plus de 15 ans d’expérience, je peux résoudre <strong>toutes les contraintes techniques</strong>, vous
          permettant de laisser libre court à votre imagination.
        </p>
      </FeatureSection>

      <FeatureSection
        tinted
        lead="Un logiciel impossible à maintenir dans le temps ?"
        accent="Je développe un produit pérenne."
        image={{ src: "/images/themes/sequoia-tree.webp", alt: "Séquoia géant dans une forêt" }}
      >
        <p>
          Mon objectif : faire que votre investissement soit de <u>long terme</u>.
        </p>
        <p>
          Je développe un produit <strong>évolutif</strong> et <strong>pérenne</strong> dans le temps :
        </p>
        <ul>
          <li>
            en produisant du <strong>code simple et efficace</strong>
          </li>
          <li>
            en <strong>réduisant la dette technique</strong> au minimum
          </li>
          <li>
            en m’appuyant sur <strong>des standards</strong> de l’industrie du logiciel.
          </li>
        </ul>
        <p>
          <br />
          Je ne réinvente pas la roue.
        </p>
        <p>
          <strong>N’importe quel développeur expérimenté du marché</strong> pourra poursuivre le travail que j’aurais
          fourni.
        </p>
      </FeatureSection>

      <PricingSection headingDescription />
      <WhoAmISection />
      <CtaSection />
    </>
  );
}

function ProblemsSection() {
  const problemClassName = "mt-2 mb-4 text-[1.75rem] leading-[1.2] font-medium text-black";

  return (
    <section className="overflow-hidden bg-surface-alt">
      <div className="boxed">
        <div className="my-[5%] px-[30px]">
          <div className="mx-auto flex max-w-[900px] flex-col gap-5 py-[30px]">
            <Reveal animation="fadeIn" className="self-center">
              <h1 className="title-lg text-ink">Vos problématiques</h1>
            </Reveal>
            <Reveal animation="fadeInLeft">
              <p className={problemClassName}>
                Vous n’avez aucune compétence en développement pour réaliser <u>votre idée de produit</u> ou pour{" "}
                <u>refondre votre produit historique vieillissant</u> ?
              </p>
            </Reveal>
            <Reveal animation="fadeInLeft" delay={125}>
              <p className={problemClassName}>
                Vous trouvez que le développement coûte <u>trop cher</u> par rapport à{" "}
                <u>la qualité du produit livré</u> ?
              </p>
            </Reveal>
            <Reveal animation="fadeInLeft" delay={250}>
              <p className={problemClassName}>
                Vous avez l’impression que les développeurs sont trop focalisés <u>sur la technique</u> et pas assez
                investis pour <u>résoudre les problèmes de vos utilisateurs</u> et <u>créer du business</u> ?
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function FrustrationsSection() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="boxed">
        <div className="my-[5%] px-[30px]">
          <div className="mx-auto flex max-w-[900px] flex-col gap-5 py-[30px]">
            <Reveal animation="fadeIn" className="self-center">
              <h2 className="title-lg text-ink">Vous êtes frustrés</h2>
            </Reveal>
            <Reveal animation="fadeInLeft">
              {/* Sur l'ancien site, le texte courant de cette liste est en graisse normale et les passages clés en gras */}
              <ul className="copy list-disc pl-10 text-black [&_b]:font-semibold [&_p]:mt-2 [&_p]:mb-4 [&_p]:text-[18px] [&_p]:leading-[1.2] [&_p]:font-medium [&_p]:text-ink md:[&_p]:text-[24px]">
                <li>
                  <p>
                    d’attendre <b>des semaines voir des mois</b> pour avoir des fonctionnalités développées ?
                  </p>
                </li>
                <li>
                  <p>
                    de voir <b>apparaître ou ré-apparaître des bugs</b> à chaque livraison de fonctionnalité ?
                  </p>
                </li>
                <li>
                  <p>
                    d’avoir un outil générique et qui <b>résout mal votre problème</b> tout en proposant beaucoup de
                    fonctionnalités <b>inutiles</b> ?
                  </p>
                </li>
                <li>
                  <p>
                    de voir qu’il est de plus en <b>plus long et coûteux</b> d’ajouter de nouvelles fonctionnalités ?
                  </p>
                </li>
                <li>
                  <p>
                    de vous voir refuser le développement de certaines fonctionnalités car jugée «&nbsp;
                    <em>trop compliquées à développer</em>&nbsp;» ?
                  </p>
                </li>
                <li>
                  <p>
                    d’avoir <b>trop d’interlocuteur</b> et ne savez plus où donner de la tête ?
                  </p>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReassuranceSection() {
  return (
    <section className="border-[5px] border-orange bg-white">
      <div className="boxed">
        <div className="my-[5%] flex flex-col gap-5 p-[30px]">
          <SectionTitle lead="Pas de panique," accent="je peux vous aider." />
          <div className="h-[56px] text-center leading-none">
            <ArrowDownIcon className="inline-block size-[50px] text-violet" />
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoAmISection() {
  return (
    <section className="overflow-hidden bg-white py-[30px]">
      <div className="boxed">
        <div className="my-[5%] flex flex-col justify-center gap-5 md:flex-row">
          <div className="flex flex-col items-start justify-center gap-5 md:w-full md:shrink md:gap-[35px] md:pr-[30%] lg:w-[628px] lg:shrink-0 lg:pr-0">
            <Reveal animation="fadeInLeft">
              <h2 className="title-xl text-ink">Qui suis-je ?</h2>
            </Reveal>
            <Reveal animation="fadeInUp">
              <p className="copy mb-[0.9rem] text-black">
                Je m’appelle Pierre Gillon. Je suis{" "}
                <strong>ingénieur en développement logiciel depuis plus de 15 ans</strong>.
              </p>
            </Reveal>
            <Reveal animation="fadeInLeft" delay={300} className="ml-5">
              <ButtonLink href="/about/">En savoir plus sur mes compétences</ButtonLink>
            </Reveal>
          </div>
          <div className="flex flex-col justify-center text-center md:w-[350px] md:shrink-0">
            <div className="overflow-hidden rounded-[10px] border-[5px] border-violet shadow-[4px_5px_10px_0_rgba(0,0,0,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/portrait.webp"
                width={512}
                height={512}
                alt="Portrait de Pierre Gillon"
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
