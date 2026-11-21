"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealAnimation =
  | "fadeIn"
  | "fadeInLeft"
  | "fadeInRight"
  | "fadeInUp"
  | "fadeInDown"
  | "rotateIn"
  | "bounceInDown"
  | "bounceInUp";

type RevealProps = {
  animation: RevealAnimation;
  /** Délai en millisecondes avant le départ de l'animation */
  delay?: number;
  /** Animation rapide (0,75 s au lieu de 1,25 s) */
  fast?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Animation d'entrée jouée une seule fois, quand l'élément arrive dans la fenêtre.
 * Reproduit les "entrance animations" d'Elementor (élément masqué puis animé).
 */
export function Reveal({ animation, delay = 0, fast, className, style, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      timer = setTimeout(() => element.classList.add("is-visible"), delay);
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn("reveal", fast && "reveal-fast", className)}
      style={{ ...style, "--reveal-name": animation } as CSSProperties}
    >
      {children}
    </div>
  );
}
