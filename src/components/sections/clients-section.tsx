import type { ReactNode } from "react";
import { Deco } from "@/components/motion/deco";
import { Reveal } from "@/components/motion/reveal";
import { SectionTitle } from "@/components/section-title";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Client = {
  logo: { src: string; width: number; height: number; alt: string; className?: string };
  role: string;
  description: ReactNode;
  className?: string;
};

const columns: Client[][] = [
  [
    {
      logo: {
        src: "/images/clients/adifis.webp",
        width: 400,
        height: 400,
        alt: "Adifis",
        className: "ml-[75px] w-[168px]",
      },
      role: "Founding engineer",
      description: (
        <p>
          Développement de A à Z d’une application saas de <strong>gestion et l’archivage des informations</strong>{" "}
          liées aux chantiers de construction pour les architectes et les maîtres d’œuvre
        </p>
      ),
      className: "rounded-none",
    },
    {
      logo: { src: "/images/clients/flexomatic.webp", width: 240, height: 240, alt: "Flexomatic" },
      role: "Chief Technology Officier (CTO)",
      description: (
        <p>
          Développement de A à Z d’une application mobile pour <strong>optimiser les revenues</strong> des livreurs
          indépendants utilisant la plateforme Amazon Flex.
        </p>
      ),
    },
  ],
  [
    {
      logo: { src: "/images/clients/agicap.webp", width: 800, height: 800, alt: "Agicap" },
      role: "Technical leader & Guild leader & Software senior developer",
      description: (
        <p>
          Développement d’une application saas de <strong>gestion et de suivi de la trésorerie</strong> des petites et
          moyennes entreprises.
        </p>
      ),
    },
    {
      logo: { src: "/images/clients/valtech.webp", width: 800, height: 420, alt: "Valtech" },
      role: "Expert .NET",
      description: <p>Développement et coaching auprès des équipes techniques des clients de Valtech (ESN).</p>,
    },
    {
      logo: { src: "/images/clients/betclic.webp", width: 800, height: 370, alt: "Betclic" },
      role: "Ingénieur en développement logiciel",
      description: (
        <p>
          Développement from scratch d’une application web de <strong>casino en ligne</strong>.
        </p>
      ),
      className: "rounded-[5px]",
    },
  ],
  [
    {
      logo: { src: "/images/clients/jcdecaux.webp", width: 800, height: 450, alt: "JCDecaux" },
      role: "Ingénieur en développement logiciel",
      description: (
        <>
          <p>
            Développement de A à Z d’un site grand public pour la <strong>vente de mobiliers urbains</strong>.
          </p>
          <p>
            Amélioration d’une application client lourd de{" "}
            <strong>positionnement et de gestion des réseaux de mobiliers urbains</strong>.
          </p>
        </>
      ),
      className: "rounded-[5px]",
    },
    {
      logo: { src: "/images/clients/aeroport-de-paris.webp", width: 800, height: 588, alt: "Paris Aéroport" },
      role: "Ingénieur en développement logiciel",
      description: (
        <p>
          Développement d’une application de <strong>gestion du dégivrage des avions</strong> sur les aéroports ORLY,
          ROISSY.
        </p>
      ),
      className: "rounded-[5px]",
    },
  ],
];

function ClientCard({ logo, role, description, className }: Client) {
  return (
    <Card className={cn("flex flex-col bg-surface hover:bg-orange", className)}>
      <div className="self-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt={logo.alt}
          loading="lazy"
          decoding="async"
          className={cn("h-auto max-w-full p-2.5", logo.className ?? "w-[380px]")}
        />
      </div>
      <div className="pb-[30px] pl-[15px]">
        <CardTitle className="mt-2.5 mb-5 transition-colors duration-500 group-hover/card:text-white">
          {role}
        </CardTitle>
        <CardContent className="transition-colors duration-500 group-hover/card:text-white [&_p]:mb-[15px]">
          {description}
        </CardContent>
      </div>
    </Card>
  );
}

/** Section "J'ai travaillé pour" : logos et missions passées. */
export function ClientsSection() {
  return (
    <section className="overflow-hidden bg-white py-[60px]">
      <div data-parallax-range className="relative my-[5%] flex flex-col items-center gap-5">
        <div className="w-full md:w-[600px] md:max-w-full">
          <Reveal animation="fadeInUp">
            <SectionTitle lead="J'ai travaillé" accent="pour" />
          </Reveal>
          <Reveal animation="fadeInUp" className="mt-5">
            <p className="copy text-center leading-6 text-muted-foreground">
              Au cours de ces dernières années, j&apos;ai travaillé dans des secteurs très variés, chez des éditeurs
              de logiciels, des ESN, des grandes entreprises et des startups.
            </p>
          </Reveal>
        </div>

        <Deco
          shape="pattern-4"
          className="top-[8.264%] left-0 z-0 w-[8%] lg:left-[4.225%]"
          reveal="rotateIn"
          rotate={1}
        />
        <Deco
          shape="pattern-1"
          className="right-[1%] bottom-[-2.156%] z-0 w-[8%] lg:right-[3.202%]"
          reveal="rotateIn"
          rotate={1}
        />

        <div className="flex w-full flex-col items-stretch gap-2.5 md:mt-[30px] md:max-w-[1000px] md:flex-row lg:mt-0">
          {columns.map((clients, index) => (
            <div key={index} className="flex flex-1 flex-col gap-5">
              {clients.map((client) => (
                <ClientCard key={client.logo.alt} {...client} />
              ))}
            </div>
          ))}
        </div>

        <Deco
          shape="pattern-3"
          className="bottom-0 left-[-1%] z-0 w-[18%] md:z-1 md:w-[8%]"
          reveal="fadeInLeft"
          y={1}
        />
        <Deco shape="pattern-2" className="top-[-5%] right-[-1%] w-[18%] md:w-[8%]" reveal="fadeInRight" y={-1} />
      </div>
    </section>
  );
}
