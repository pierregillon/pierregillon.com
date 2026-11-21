import { CheckCircleIcon } from "@/components/icons";
import { Deco } from "@/components/motion/deco";
import { Reveal } from "@/components/motion/reveal";
import { SectionTitle } from "@/components/section-title";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  color: "violet" | "orange";
  nameClassName?: string;
  className?: string;
};

const plans: Plan[] = [
  {
    name: "Founding engineer",
    price: "800€* / jour",
    description: "Je m'occupe du développement intégral de votre produit",
    features: [
      "Responsable tech hands-on",
      "Développement des fonctionnalités de A à Z",
      "Clean code & Clean architecture",
      "Stratégie produit & Product Market Fit",
      "Iterations rapides",
      "Atelier collaboratif de conception",
      "Supervision de l'infrastructure",
      "CI / CD",
      "Communiquer et valoriser les choix tech auprès d'investisseurs",
    ],
    color: "violet",
  },
  {
    name: "Technical leader",
    price: "800€ / jour",
    description: "Je viens renforcer votre équipe tech existante",
    features: [
      "Tech lead ou Lead dev",
      "Développement des fonctionnalités",
      "Supervision de l'infrastructure",
      "Gestion des bugs",
      "Promotion des pratiques agiles",
      "Tests automatisés",
      "Leadership / Mentorship",
      "Business impact first",
    ],
    color: "orange",
  },
  {
    name: "Craft coach",
    price: "1000€ / jour",
    description: "Je viens coacher votre équipe tech existante sur les sujets de votre choix",
    features: [
      "Clean code & Clean architecture",
      "Business impact first",
      "Continuous Delivery",
      "Product strategy",
      "Domain Driven Design",
      "Tests automatisés",
      "Livraison no down time",
      "No estimate",
      "CQRS & Event sourcing",
    ],
    color: "violet",
    nameClassName: "max-w-[222px] self-center",
    className: "lg:pl-10",
  },
];

const palette = {
  violet: { background: "bg-[url(/images/bg/pricing-basic.png)]", price: "text-violet", icon: "text-violet-alt" },
  orange: { background: "bg-[url(/images/bg/pricing-premium.png)]", price: "text-orange", icon: "text-orange" },
} as const;

function PricingCard({ plan, descriptionClassName }: { plan: Plan; descriptionClassName?: string }) {
  const colors = palette[plan.color];

  return (
    <article
      className={cn(
        "m-[5px] flex flex-1 flex-col gap-2.5 rounded-[5px] bg-white bg-contain bg-top-left bg-no-repeat p-10 transition-shadow duration-300 hover:shadow-[3px_5px_15px_0_rgba(0,0,0,0.14)] md:p-2.5 lg:px-[30px] lg:pt-[35px] lg:pb-10",
        colors.background,
        plan.className,
      )}
    >
      <h3
        className={cn(
          "text-center font-heading text-[40px] leading-[1.1] font-semibold text-white uppercase md:text-[45px] md:leading-[1.2] lg:text-[2.5rem]",
          plan.nameClassName,
        )}
      >
        {plan.name}
      </h3>
      <p
        className={cn(
          "mt-[90px] mb-2.5 text-center font-heading text-[30px] leading-[1.1] font-semibold uppercase md:mt-[30px] md:text-[25px] lg:mt-[75px] lg:text-[2rem]",
          colors.price,
        )}
      >
        {plan.price}
      </p>
      <p className={cn("title-card text-ink uppercase", descriptionClassName)}>{plan.description}</p>
      <ul className="font-open my-2.5 flex-1 text-base text-ink">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center not-last:pb-[7.5px] not-first:mt-[7.5px]">
            <CheckCircleIcon className={cn("mr-1 size-4 shrink-0", colors.icon)} />
            <span className="pl-[5px]">{feature}</span>
          </li>
        ))}
      </ul>
      <ButtonLink
        href={site.calendly}
        variant={plan.color === "violet" ? "primary" : "secondary"}
        size="lg"
        className="self-center"
      >
        Choisir
      </ButtonLink>
    </article>
  );
}

type PricingSectionProps = {
  /** Classes du texte d'accroche de chaque offre (la page "Mon offre" l'affiche en Oswald). */
  descriptionClassName?: string;
};

/** Section "Mes tarifs" : les trois formules d'accompagnement. */
export function PricingSection({ descriptionClassName }: PricingSectionProps) {
  return (
    <section className="overflow-hidden bg-surface py-[60px]">
      <div data-parallax-range className="relative my-[5%] flex flex-col items-center gap-5">
        <div className="w-full md:w-[600px] md:max-w-full">
          <Reveal animation="fadeInUp">
            <SectionTitle lead="Mes" accent="Tarifs" />
          </Reveal>
          <Reveal animation="fadeInUp" className="mt-5">
            <p className="copy text-center text-muted-foreground">
              Je propose différents tarifs en fonction de l&apos;accompagnement que vous souhaitez. Ces tarifs sont
              indicatifs et peuvent varier en fonction de la durée de mission, la taille de l&apos;entreprise et des
              responsabilités occupées.
            </p>
          </Reveal>
        </div>

        <Deco
          shape="shape-1"
          className="top-[13%] left-[-10%] z-0 w-[39%] md:top-[17%] md:left-[-2%] md:w-[14%] lg:top-[6.003%] lg:left-[4.502%]"
          reveal="fadeIn"
          revealDelay={500}
          y={-1}
          x={1}
        />
        <Deco
          shape="pricing-shape"
          className="right-[-7%] bottom-[-2%] z-0 w-[31%] md:right-[-5%] md:bottom-[-4%] md:w-[14%] lg:right-[11%] lg:bottom-[-8%]"
          reveal="fadeIn"
          revealDelay={500}
          y={1}
          x={-1}
        />
        <Deco shape="pattern-2" className="top-[-5%] right-[-1%] w-[18%] md:w-[8%]" reveal="fadeInRight" y={-1} />
        <Deco
          shape="pattern-3"
          className="bottom-0 left-[-1%] z-0 w-[18%] md:z-1 md:w-[8%]"
          reveal="fadeInLeft"
          y={1}
        />

        <Reveal animation="fadeInUp" className="relative z-1 mt-[30px] w-full">
          <div className="mx-auto flex max-w-[1100px] flex-col items-stretch justify-center gap-2.5 md:flex-row">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} descriptionClassName={descriptionClassName} />
            ))}
          </div>
        </Reveal>

        <p className="copy mb-[0.9rem] text-black md:w-[48%]">
          &nbsp;* pour la rémunération{" "}
          <strong>
            <em>founding engineer</em>
          </strong>
          , je suis ouvert à la négociation en fonction du stade de l’entreprise : de l’
          <strong>
            <em>equity</em>
          </strong>{" "}
          est envisageable afin de réduire la rémunération fixe.
        </p>
      </div>
    </section>
  );
}
