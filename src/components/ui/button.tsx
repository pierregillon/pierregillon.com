import Link from "next/link";
import type { ComponentProps } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Boutons du site (design system shadcn, personnalisé aux couleurs de la marque) :
 * texte Oswald en capitales, coins peu arrondis, bordure 1 px.
 */
const buttonVariants = cva(
  "inline-block cursor-pointer border text-center font-heading text-base leading-none font-normal whitespace-nowrap uppercase transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /** Orange plein, s'assombrit au survol */
        default:
          "border-orange bg-orange text-white hover:border-orange-dark hover:bg-orange-dark focus-visible:border-orange-dark focus-visible:bg-orange-dark",
        /** Contour orange, texte blanc (sur fond violet) */
        ghost:
          "border-orange bg-transparent text-white hover:border-orange-dark hover:bg-orange-dark focus-visible:border-orange-dark focus-visible:bg-orange-dark",
        /** Contour orange, texte orange (sur fond clair) */
        outline:
          "border-orange bg-transparent text-orange hover:border-orange-dark hover:bg-orange-dark hover:text-white focus-visible:border-orange-dark focus-visible:bg-orange-dark focus-visible:text-white",
        /** Violet plein, s'inverse au survol */
        primary:
          "border-violet-alt bg-violet-alt tracking-[0.5px] text-white hover:bg-transparent hover:text-violet-alt focus-visible:bg-transparent focus-visible:text-violet-alt",
        /** Orange plein, s'inverse au survol */
        secondary:
          "border-orange bg-orange tracking-[0.5px] text-white hover:bg-transparent hover:text-orange focus-visible:bg-transparent focus-visible:text-orange",
      },
      size: {
        default: "rounded-[2px] px-[35px] py-3",
        lg: "rounded-[3px] px-[30px] py-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonPrimitive.Props & ButtonVariants) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

type ButtonLinkProps = ButtonVariants & Omit<ComponentProps<"a">, "href"> & { href: string };

/** Lien stylé comme un bouton ; les URLs externes s'ouvrent via une balise <a> classique. */
function ButtonLink({ className, variant, size, href, ...props }: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size, className }));
  if (/^https?:\/\//.test(href)) {
    return (
      <a
        data-slot="button"
        href={href}
        className={classes}
        rel={props.target === "_blank" ? "noopener noreferrer" : undefined}
        {...props}
      />
    );
  }
  return <Link data-slot="button" href={href} className={classes} {...props} />;
}

export { Button, ButtonLink, buttonVariants };
