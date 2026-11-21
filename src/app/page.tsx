import {
  ArrowDownIcon,
  ArrowsAltHIcon,
  BlackTieIcon,
  BoltIcon,
  CodeIcon,
  GemIcon,
  MoneyBillAltIcon,
} from "@/components/icons";
import { InfoBox } from "@/components/info-box";
import { Deco } from "@/components/motion/deco";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SectionTitle } from "@/components/section-title";
import { ClientsSection } from "@/components/sections/clients-section";
import { CtaSection } from "@/components/sections/cta-section";
import { LatestPostsSection } from "@/components/sections/latest-posts-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <PracticesSection />
      <ClientsSection />
      <PricingSection />
      <CtaSection maxWidth={985} />
      <LatestPostsSection />
    </>
  );
}

function HeroSection() {
  return (
    <section
      data-parallax-range
      className="relative flex min-h-[95vh] flex-col items-center justify-center gap-5 overflow-hidden bg-violet bg-[url(/images/bg/hero-bg.jpg)] bg-cover bg-position-[top_right] bg-no-repeat md:min-h-[45vh] lg:min-h-[90vh]"
    >
      <div className="mx-2.5 mt-2.5 mb-[50px] flex flex-col-reverse gap-2.5 p-6 md:w-[1000px] md:max-w-[calc(100%-20px)] md:flex-row md:p-0">
        <div className="flex flex-col gap-5 border-l-[5px] border-orange p-2.5 md:w-[60%] md:px-5 md:py-[30px]">
          <Reveal animation="fadeInLeft">
            <p className="copy mb-[0.9rem] text-white">Salut, je suis Pierre</p>
          </Reveal>
          <Reveal animation="fadeInLeft" delay={100}>
            <SectionTitle as="h1" light lead="Développeur logiciel" accent="Freelance" className="text-left" />
          </Reveal>
          <Reveal animation="fadeInLeft" delay={200}>
            <ul className="copy list-disc pl-10 text-white">
              <li>Software craftsman</li>
              <li>Product-minded</li>
              <li>Founding engineer</li>
            </ul>
          </Reveal>
          <Reveal animation="fadeInLeft" delay={300} className="ml-5">
            <ButtonLink href="/about/">En savoir plus</ButtonLink>
          </Reveal>
          <Reveal animation="fadeInLeft" delay={300} className="ml-5">
            <ButtonLink href={site.calendly} target="_blank" variant="ghost">
              Me contacter
            </ButtonLink>
          </Reveal>
        </div>

        <div className="flex flex-col justify-center gap-5 md:w-[40%]">
          <div aria-hidden className="h-2.5 md:h-[50px]" />
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/portrait.webp"
              width={512}
              height={512}
              alt="Portrait de Pierre Gillon"
              fetchPriority="high"
              className="inline-block h-auto max-w-full rounded-[20px] border-[10px] border-white"
            />
          </div>
        </div>
      </div>

      <Deco
        shape="pattern-1"
        className="top-[-8vh] left-[-8%] w-[22%] md:top-[-12vh] md:left-[-5%] md:w-[10%] lg:top-[-25vh]"
        reveal="rotateIn"
        rotate={1}
      />
      <Deco
        shape="pattern-2"
        className="top-[-7vh] right-[-3%] w-[20%] md:w-[6%] lg:top-[-12vh]"
        reveal="fadeInRight"
        y={-0.6}
      />
      <Deco
        shape="pattern-3"
        className="bottom-[-4vh] left-[-3%] z-0 w-[20%] md:bottom-[-8vh] md:z-1 md:w-[6%] lg:bottom-[-12vh]"
        reveal="fadeInLeft"
        y={0.6}
      />
    </section>
  );
}

function IntroSection() {
  return (
    // Toute la section glisse légèrement au défilement de la page (elle chevauche le bas du bandeau d'accueil).
    <Parallax y={-1} className="relative">
      <section
        data-parallax-range
        className="relative flex flex-col gap-2.5 overflow-hidden bg-white px-5 py-[30px] md:px-[5%] md:pt-[5%] md:pb-0"
      >
        <Deco
          shape="pattern-3"
          className="bottom-0 left-[-1%] z-0 w-[18%] md:z-1 md:w-[8%]"
          reveal="fadeInLeft"
          y={1}
        />
        <Deco
          shape="pattern-4"
          className="top-5 left-[37.314%] w-[2%]"
          reveal="bounceInDown"
          revealFast
          x={-1}
        />
        <Deco
          shape="pattern-1"
          className="right-[36%] bottom-[4%] w-[5.959%]"
          imgClassName="w-10"
          reveal="bounceInUp"
          revealFast
          x={1}
        />

        <div data-parallax-range className="boxed relative flex flex-col gap-5">
          <Deco shape="pattern-2" className="top-[-5%] right-[-1%] w-[18%] md:w-[8%]" reveal="fadeInRight" y={-1} />

          <div data-parallax-range className="relative my-5 flex flex-col justify-center gap-5 self-center md:w-[84%]">
            <p className="title-lg mb-[0.9rem] text-ink">
              «&nbsp;Je transforme votre <u>idée business</u> en <u>produit numérique sur mesure</u>.&nbsp;»
            </p>
            <div className="rich-text copy text-muted-foreground">
              <p>
                Avec 15 ans d’expérience dans le développement logiciel, dont 5 ans en startup, j’accompagne
                aujourd’hui les startups / tpe, dans le développement <strong>A à Z</strong> de leur produit numérique
                (SaaS, outil interne, web, client lourd, …) <strong>sur mesure</strong>, en alliant{" "}
                <strong>vitesse d’exécution</strong> et <strong>qualité de réalisation</strong>.
              </p>
              <p>
                Grâce à une <strong>stratégie produit claire</strong> et à la récolte du{" "}
                <strong>feedback utilisateur</strong>, je livre <strong>quotidiennement</strong> de nouvelles
                fonctionnalités à <strong>forte valeur ajoutée</strong> tout en garantissant un produit{" "}
                <strong>pérenne</strong> et <strong>évolutif</strong>.
              </p>
            </div>
            <Deco shape="shape-1" className="top-[-44%] left-[-10%] w-[8%]" y={-1} x={-1} />
            <Deco shape="shape-2" className="top-[80%] right-[-7%] w-[8%]" y={1} x={1} />
          </div>
        </div>

        <Reveal animation="fadeInDown" delay={250} className="h-[60px] text-center leading-none">
          <ArrowDownIcon className="inline-block size-[54px] text-violet" />
        </Reveal>
      </section>
    </Parallax>
  );
}

function PracticesSection() {
  return (
    <section className="overflow-hidden bg-surface px-5 py-[30px] md:px-0 md:py-[60px]">
      <div data-parallax-range className="relative">
        <Deco shape="shape-rect" className="top-[40%] right-[-6%] z-0 w-[16%]" />
        <Deco
          shape="pattern-3"
          className="bottom-0 left-[-1%] z-0 w-[18%] md:z-1 md:w-[8%]"
          reveal="fadeInLeft"
          y={1}
        />
        <Deco
          shape="pattern-1"
          className="top-[13%] left-[-1px] z-0 w-[18%] md:top-[18%] md:w-[10%] lg:top-[8.344%] lg:left-[2.19%]"
          reveal="rotateIn"
          rotate={1}
        />
        <Deco
          shape="pattern-4"
          className="right-[0.1px] bottom-[-1%] z-0 w-[18%] md:bottom-[-3%] md:w-[10%] lg:right-[12%]"
          reveal="rotateIn"
          rotate={1}
        />

        <div className="boxed flex flex-col items-center gap-5">
          <div className="w-full md:w-[600px] md:max-w-full">
            <Reveal animation="fadeInUp">
              <SectionTitle lead="Mes pratiques en" accent="détail" />
            </Reveal>
            <Reveal animation="fadeInUp" className="mt-5">
              <p className="copy text-center leading-6 text-muted-foreground">
                Voici les pratiques que je mets en place dans le développement de votre produit.
              </p>
            </Reveal>
          </div>

          <div className="relative mt-[30px] flex w-full flex-col items-stretch gap-2.5 md:w-[1000px] md:max-w-full md:flex-row">
            <InfoBox icon={GemIcon} color="violet" title="Fort impact business">
              <p>
                Je suis pragmatique et je développe en priorité ce qui à le <strong>plus de valeur</strong> pour vous
                et vos utilisateurs.
              </p>
            </InfoBox>
            <InfoBox icon={CodeIcon} color="orange" title="Qualité logicielle" tight>
              <p>
                Je travaille avec les meilleurs standards de l’industrie du logiciel, votre produit sera{" "}
                <strong>de qualité</strong>, réduisant les bugs au maximum.
              </p>
            </InfoBox>
            <InfoBox icon={BoltIcon} color="sky" title="Itérations rapides" tight>
              <p>
                Pour trouver votre <strong>product market fit</strong>, j’itère à la vitesse de l’éclair : mise en
                production des fonctionnalités <strong>plusieurs fois par jour</strong>, sans interruption de service.
              </p>
            </InfoBox>
          </div>
          <div className="relative flex w-full flex-col items-stretch gap-2.5 md:w-[1000px] md:max-w-full md:flex-row">
            <InfoBox icon={ArrowsAltHIcon} color="orange" title="De A à Z">
              <p>
                Je développe <strong>tous les aspects du produit</strong> : codage des fonctionnalités, mise en place
                de l’infrastructure cloud, CI/CD, monitoring. Vous aurez un interlocuteur unique.
              </p>
            </InfoBox>
            <InfoBox icon={MoneyBillAltIcon} color="sky" title="Un tarif unique">
              <p>
                Vous ne facturerez qu’un seul profil : <strong>le mien</strong>, et mon tarif sera bien inférieur à ce
                que vous facturerait une ESN.
              </p>
            </InfoBox>
            <InfoBox icon={BlackTieIcon} color="violet" title="Sur mesure">
              <p>
                Je construits un produit <strong>sur mesure</strong> et adapté spécifiquement au problème que vous
                cherchez à adresser, sans contrainte technique.
              </p>
            </InfoBox>
          </div>

          <Reveal animation="fadeInRight" className="mt-5">
            <ButtonLink href="/mon-offre/" variant="outline">
              En savoir plus
            </ButtonLink>
          </Reveal>
        </div>

        <Deco shape="pattern-2" className="top-[-5%] right-[-1%] w-[18%] md:w-[8%]" reveal="fadeInRight" y={-1} />
      </div>
    </section>
  );
}
