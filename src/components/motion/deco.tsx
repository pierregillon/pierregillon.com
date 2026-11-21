import { cn } from "@/lib/utils";
import { Parallax } from "./parallax";
import { Reveal, type RevealAnimation } from "./reveal";

const shapes = {
  /** Disque rayé orange */
  "pattern-1": { src: "/images/shapes/pattern-1.png", width: 212, height: 212 },
  /** Grille de points orange */
  "pattern-2": { src: "/images/shapes/pattern-2.png", width: 125, height: 188 },
  /** Grille de points turquoise */
  "pattern-3": { src: "/images/shapes/pattern-3.png", width: 125, height: 188 },
  /** Petit disque rayé turquoise */
  "pattern-4": { src: "/images/shapes/pattern-4.png", width: 83, height: 83 },
  /** Demi-disque orange */
  "shape-1": { src: "/images/shapes/shape-1.png", width: 270, height: 269 },
  /** Demi-disque turquoise */
  "shape-2": { src: "/images/shapes/shape-2.png", width: 270, height: 269 },
  /** Rectangle orange */
  "shape-rect": { src: "/images/shapes/shape-rect.jpg", width: 375, height: 681 },
  /** Demi-disque violet */
  "pricing-shape": { src: "/images/shapes/pricing-shape.png", width: 270, height: 269 },
} as const;

type DecoProps = {
  shape: keyof typeof shapes;
  /** Position et largeur (classes utilitaires) : l'élément est en `position: absolute`. */
  className?: string;
  /** Animation d'entrée */
  reveal?: RevealAnimation;
  revealDelay?: number;
  revealFast?: boolean;
  /** Effets de défilement, voir <Parallax /> */
  x?: number;
  y?: number;
  rotate?: number;
  /** Largeur fixe de l'image (sinon sa taille naturelle, limitée à la largeur du conteneur) */
  imgClassName?: string;
};

/** Forme décorative positionnée en absolu dans une section, animée à l'entrée et au défilement. */
export function Deco({ shape, className, reveal, revealDelay, revealFast, x, y, rotate, imgClassName }: DecoProps) {
  const { src, width, height } = shapes[shape];
  const hasParallax = Boolean(x || y || rotate);

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={width}
      height={height}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn("inline-block h-auto max-w-full", imgClassName)}
    />
  );
  const content = hasParallax ? (
    <Parallax x={x} y={y} rotate={rotate} range="[data-parallax-range]">
      {image}
    </Parallax>
  ) : (
    image
  );
  const classes = cn("pointer-events-none absolute z-1 text-center select-none", className);

  return reveal ? (
    <Reveal animation={reveal} delay={revealDelay} fast={revealFast} className={classes}>
      {content}
    </Reveal>
  ) : (
    <div aria-hidden className={classes}>
      {content}
    </div>
  );
}
