import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  BusinessTimeIcon,
  GithubIcon,
  HandsHelpingIcon,
  LinkedinIcon,
  ShareAltIcon,
  XTwitterIcon,
} from "@/components/icons";
import { InfoBox } from "@/components/info-box";
import { Reveal } from "@/components/motion/reveal";
import { SectionTitle } from "@/components/section-title";
import { ClientsSection } from "@/components/sections/clients-section";
import { CtaSection } from "@/components/sections/cta-section";
import { LatestPostsSection } from "@/components/sections/latest-posts-section";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "A propos",
};

export default function AboutPage() {
  return (
    <>
      <IntroSection />
      <ServicesSection />
      <TShapeSection />

      <TierSection
        tinted
        imageRight
        first
        lead="S TIER -"
        accent="Programming skills"
        image={{ src: "/images/themes/monitor-with-code.webp", alt: "Écran affichant du code" }}
      >
        <p>
          Je suis expert sur les technologies <strong>Microsoft .NET, C#</strong> et TS, JS.
        </p>
        <p>
          Pour un logiciel pérenne,&nbsp; j’utilise les meilleures pratiques de l’industrie parmi lesquelles:{" "}
          <ExternalLink href="https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29">Clean code</ExternalLink>
          ,{" "}
          <ExternalLink href="https://www.educative.io/blog/clean-architecture-tutorial">
            Clean architecture
          </ExternalLink>
          , <ExternalLink href="https://en.wikipedia.org/wiki/Test_automation">Automatisation des tests</ExternalLink>,{" "}
          <ExternalLink href="https://domainlanguage.com/ddd/reference/">Domain Driven Design</ExternalLink>, et{" "}
          <ExternalLink href="https://en.wikipedia.org/wiki/Test-driven_development">
            Test Driven Development
          </ExternalLink>
          .
        </p>
        <p>
          Fullstack, je suis capable de construire des <strong>applications frontend</strong> (
          <ExternalLink href="https://angular.io/">Angular</ExternalLink>,{" "}
          <ExternalLink href="https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor">Blazor</ExternalLink>),
          backend (api, .netcore), <strong>mobiles</strong> (
          <ExternalLink href="https://dotnet.microsoft.com/en-us/apps/maui">MAUI</ExternalLink>) et{" "}
          <strong>client lourd</strong> (WPF, Winform).
        </p>
        <p>
          J’intègre facilement des apis externes à la demande comme <strong>SendGrid</strong>,{" "}
          <strong>OpenAI</strong>, <strong>Twillio</strong>, …
        </p>
      </TierSection>

      <TierSection
        lead="A TIER -"
        accent="Product Management"
        image={{ src: "/images/themes/post-it-board.webp", alt: "Tableau couvert de post-it" }}
      >
        <p>
          J’aime avoir de l’impact auprès <strong>des utilisateurs</strong>.
        </p>
        <p>
          Je travaille <strong>itérativement</strong> afin de construire pas à pas, le meilleur produit, grâce à la
          récolte du <strong>feedback des utilisateurs</strong>.
        </p>
        <p>
          Je structure un backlog produit, rédige, découpe et priorise les <strong>incréments fonctionnels</strong>.
        </p>
        <p>
          Je maîtrise des outils d’intelligence collective pour concevoir et modéliser un produit :{" "}
          <ExternalLink href="https://www.eventstorming.com/">Eventstorming</ExternalLink>, EventModelling,{" "}
          <ExternalLink href="https://www.easyagile.com/blog/the-ultimate-guide-to-user-story-maps/">
            Story mapping
          </ExternalLink>
          ,{" "}
          <ExternalLink href="https://cucumber.io/blog/bdd/example-mapping-introduction/">Example mapping</ExternalLink>
          .
        </p>
      </TierSection>

      <TierSection
        tinted
        imageRight
        lead="B TIER -"
        accent="Infrastructure & CI/CD"
        image={{ src: "/images/themes/datacenter.webp", alt: "Baie de serveurs dans un datacenter" }}
      >
        <p>
          J’ai une très bonne connaissance de l’environnement{" "}
          <ExternalLink href="https://azure.microsoft.com">Microsoft Cloud Azure</ExternalLink>. Je suis capable de
          déployer et d’administrer les applications cloud, ainsi que les services Microsoft :{" "}
          <strong>base de données (sql, nosql), file storage, AI, monitoring.</strong>
        </p>
        <p>
          Je suis familié avec les outils opensource lié à l’infrastructure :{" "}
          <ExternalLink href="https://kubernetes.io/">Kubernetes</ExternalLink>,{" "}
          <ExternalLink href="https://www.docker.com/">Docker</ExternalLink>,{" "}
          <ExternalLink href="https://opentelemetry.io/">OpenTelemetry</ExternalLink> et des outils de monitoring comme{" "}
          <ExternalLink href="https://prometheus.io">Prometeus</ExternalLink>.
        </p>
        <p>
          Je suis capable de construire une pipeline d’<strong>intégration</strong> et de{" "}
          <strong>déploiement</strong> continue dans tout environnement (
          <ExternalLink href="https://about.gitlab.com/">Gitlab</ExternalLink>,{" "}
          <ExternalLink href="https://github.com">Github workflow</ExternalLink>,{" "}
          <ExternalLink href="https://azure.microsoft.com/en-us/products/devops/">Azure devops</ExternalLink>, …).
        </p>
      </TierSection>

      <TierSection
        lead="B TIER -"
        accent="Business strategy"
        image={{ src: "/images/themes/business-meeting.webp", alt: "Réunion autour de graphiques" }}
      >
        <p>
          Je suis à l’aise pour <strong>challenger</strong> et <strong>bonifier</strong> une stratégie Business
          orientées startups / tpe, notamment sur les thème de l’<strong>audience</strong>, la{" "}
          <strong>proposition de valeur</strong> et le <strong>modèle de tarification</strong>.
        </p>
        <p>
          J’aime utiliser des outils ultra synthétique comme le{" "}
          <ExternalLink href="https://bpifrance-creation.fr/moment-de-vie/lean-canvas-lapplication-methode-du-lean-startup">
            Lean Canvas
          </ExternalLink>{" "}
          ou le{" "}
          <ExternalLink href="https://www.lecoindesentrepreneurs.fr/canevas-de-proposition-de-valeur/">
            Value Proposition canvas
          </ExternalLink>{" "}
          pour avoir une vision macro du contexte de développement d’un produit numérique.
        </p>
      </TierSection>

      <TierSection
        tinted
        imageRight
        lead="C TIER -"
        accent="Marketing"
        image={{ src: "/images/themes/tablette-abstract.webp", alt: "Illustration abstraite d'une tablette" }}
      >
        <p>
          J’ai des connaissances de base en Marketing et je peux vous challenger dans vos réflexions autour de l’
          <strong>inbound marketing</strong> (SEO, blog, social media, newletters, podcast, vidéo, webinar,
          affiliation) et l’<strong>outbound marketing</strong> (publicité, adwords, emailing).
        </p>
        <p>Cependant, j’ai peu de vision sur les outils adaptés aux besoins spécifiques des entreprises.</p>
      </TierSection>

      <ClientsSection />
      <CtaSection />
      <LatestPostsSection />
    </>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const socials = [
  { label: "Linkedin", href: site.social.linkedin, Icon: LinkedinIcon, className: "bg-[#0077b5]" },
  { label: "X (Twitter)", href: site.social.twitter, Icon: XTwitterIcon, className: "bg-black" },
  { label: "Github", href: site.social.github, Icon: GithubIcon, className: "bg-[#333]" },
];

function IntroSection() {
  return (
    <section className="overflow-hidden bg-white px-[5%] lg:px-[8%]">
      <div className="flex flex-col justify-center gap-5 lg:min-h-[650px] lg:flex-row lg:items-stretch lg:gap-[30px]">
        <div className="flex flex-col items-start justify-center gap-5 md:gap-[35px] md:pr-[30%] lg:w-[676px] lg:shrink-0 lg:pr-0">
          <Reveal animation="fadeInLeft">
            <h1 className="title-xl text-ink">Qui suis-je ?</h1>
          </Reveal>
          <Reveal animation="fadeInUp" className="rich-text copy text-black">
            <p>
              Je m’appelle Pierre Gillon. Je suis{" "}
              <strong>ingénieur en développement logiciel depuis plus de 15 ans</strong>.
            </p>
            <p>
              Tout d’abord salarié chez des éditeurs de logiciel, des ESN et des Startups, je suis dorénavant{" "}
              <strong>freelance</strong>, dans la région Lyonnaise.
            </p>
          </Reveal>
          <Reveal animation="fadeInUp" className="flex w-full flex-row gap-[5px]">
            <ul className="flex gap-[5px]">
              {socials.map(({ label, href, Icon, className }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex size-[50px] items-center justify-center rounded-[10%] text-white transition-opacity duration-300 hover:opacity-90",
                      className,
                    )}
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-[25px]" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={site.social.malt}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[6.805%] shrink-0 self-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/malt.webp" width={200} height={200} alt="Malt" className="h-auto max-w-full" />
            </a>
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
              fetchPriority="high"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="overflow-hidden bg-surface">
      <div className="boxed">
        <div className="my-[5%] flex flex-col items-center gap-5">
          <div className="flex w-full flex-col gap-5 md:w-[700px] md:max-w-full">
            <Reveal animation="fadeInUp">
              <SectionTitle lead="À votre" accent="service" />
            </Reveal>
            <div className="rich-text copy text-center text-muted-foreground">
              <p>
                De développeur à Software craftsman en passant par Architecte logiciel, avec le titre que vous
                préférez, je vous aide à construire un <strong>produit pérenne</strong> qui a de l’
                <strong>impact pour vos utilisateurs</strong>.
              </p>
              <p>Je m’adapte à vos besoins et à votre organisation.</p>
            </div>
          </div>

          <div className="mt-[30px] flex w-full flex-col items-stretch gap-2.5 md:w-[1000px] md:max-w-full md:flex-row">
            <InfoBox icon={BusinessTimeIcon} color="violet" title="Founding engineer">
              <p>
                Je m’occupe du développement intégral de votre application Web afin de vous fournir un produit clef en
                main.
              </p>
            </InfoBox>
            <InfoBox icon={HandsHelpingIcon} color="orange" title="Technical leader">
              <p>
                Je viens renforcer votre équipe tech existante, afin de contribuer à construire un produit de qualité
                en essaimant les pratiques crafts.
              </p>
            </InfoBox>
            <InfoBox icon={ShareAltIcon} color="sky" title="Craft coach">
              <p>
                Je viens coacher votre équipe tech existante sur les sujets crafts de votre choix, du clean code à de
                l’architecture en passant par les pratiques continuous delivery.
              </p>
            </InfoBox>
          </div>
        </div>
      </div>
    </section>
  );
}

function TShapeSection() {
  return (
    <section className="my-[5%] overflow-hidden">
      <div className="mx-auto flex flex-col gap-5 md:max-w-[80%]">
        <Reveal animation="fadeInUp" className="text-center">
          <SectionTitle lead="Mon profil" accent="T-Shape" />
          <p className="copy mb-[0.9rem] text-muted-foreground">
            J’ai un profil polyvalent avec une forte expertise dans le développement logiciel.
          </p>
        </Reveal>
        <Reveal animation="fadeInUp" className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/themes/tshape-profile.webp"
            width={1410}
            height={709}
            alt="Schéma de mon profil T-Shape : expertise forte en programmation, compétences en product management, business strategy, CI/CD & infrastructure et marketing"
            loading="lazy"
            decoding="async"
            className="inline-block h-auto w-[80%] max-w-[1000px] rounded-[10px] border-[5px] border-violet"
          />
        </Reveal>
      </div>
    </section>
  );
}

type TierSectionProps = {
  lead: string;
  accent: string;
  image: { src: string; alt: string };
  /** Image à droite du texte (sur mobile, elle passe alors sous le texte) */
  imageRight?: boolean;
  tinted?: boolean;
  /** Première section de la série : marges un peu plus serrées */
  first?: boolean;
  children: ReactNode;
};

/** Niveau de compétence ("S TIER", "A TIER"…) illustré par une image. */
function TierSection({ lead, accent, image, imageRight, tinted, first, children }: TierSectionProps) {
  return (
    <section
      className={cn(
        "mt-[35%] overflow-hidden px-[5%] md:mt-[25%] lg:mt-0 lg:px-0",
        tinted ? "bg-[#f8f8f8]" : "bg-white",
      )}
    >
      <div className={first ? "p-[3%]" : "p-[5%]"}>
        <div className="mx-auto max-w-[1200px] px-[30px]">
          <div
            className={cn(
              "mx-auto flex max-w-[1000px] items-center gap-[30px] py-[30px]",
              imageRight ? "flex-col-reverse md:flex-row-reverse" : "flex-col md:flex-row",
            )}
          >
            <Reveal animation={imageRight ? "fadeInRight" : "fadeInLeft"} className="text-center md:flex-[0_1_auto]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                width={800}
                height={800}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="inline-block h-auto max-w-full rounded-[10px] border-[5px] border-violet"
              />
            </Reveal>
            <Reveal
              animation={imageRight ? "fadeInLeft" : "fadeInRight"}
              className="flex w-full flex-col gap-5 md:flex-[0_1_100%]"
            >
              <h2 className="title-lg py-2.5">
                <span className="text-ink">{lead}</span> <span className="text-orange">{accent}</span>
              </h2>
              <div className="rich-text copy text-muted-foreground">{children}</div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
