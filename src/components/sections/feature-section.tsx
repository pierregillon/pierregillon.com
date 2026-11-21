import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type FeatureSectionProps = {
  /** Début du titre (couleur sombre) */
  lead: string;
  /** Fin du titre (orange) */
  accent: string;
  image: { src: string; alt: string };
  /** Image à gauche et texte à droite (sur mobile, l'image passe au-dessus) */
  reverse?: boolean;
  /** Fond légèrement teinté, pour alterner avec les sections blanches */
  tinted?: boolean;
  /** Classes du conteneur (largeur maximale, espacement entre colonnes) */
  className?: string;
  /** Classes du bloc texte / du bloc image (comportement flex) */
  textClassName?: string;
  imageClassName?: string;
  /** Classes du texte courant */
  bodyClassName?: string;
  children: ReactNode;
};

/** Section "titre bicolore + texte" accompagnée d'une illustration encadrée de violet. */
export function FeatureSection({
  lead,
  accent,
  image,
  reverse,
  tinted,
  className,
  textClassName,
  imageClassName,
  bodyClassName,
  children,
}: FeatureSectionProps) {
  return (
    <section className={cn("overflow-hidden", tinted ? "bg-surface-alt" : "bg-white")}>
      <div className="boxed">
        <div className="my-[5%] px-[30px]">
          <div
            className={cn(
              "mx-auto flex max-w-[1100px] gap-[30px] py-[30px]",
              reverse ? "flex-col-reverse md:flex-row-reverse" : "flex-col md:flex-row",
              className,
            )}
          >
            <Reveal
              animation={reverse ? "fadeInRight" : "fadeInLeft"}
              className={cn("flex flex-col gap-5 md:flex-[1_1_100%] md:self-center", textClassName)}
            >
              <h2 className="title-lg py-2.5">
                <span className="text-ink">{lead}</span> <span className="text-orange">{accent}</span>
              </h2>
              <div className={cn("rich-text copy text-black", bodyClassName)}>{children}</div>
            </Reveal>
            <Reveal
              animation={reverse ? "fadeInLeft" : "fadeInRight"}
              className={cn("text-center md:flex-[1_1.2_auto] md:self-center", imageClassName)}
            >
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
          </div>
        </div>
      </div>
    </section>
  );
}
