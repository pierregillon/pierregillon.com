"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  /** Vitesse verticale. Positif : l'élément remonte en défilant ; négatif : il descend. */
  y?: number;
  /** Vitesse horizontale. Positif : vers la gauche en défilant ; négatif : vers la droite. */
  x?: number;
  /** Vitesse de rotation (en degrés), même convention de signe. */
  rotate?: number;
  /**
   * Élément dont la progression dans la fenêtre pilote l'effet :
   * "parent" (par défaut) ou un sélecteur CSS passé à `closest()`.
   */
  range?: "parent" | (string & {});
  className?: string;
  children?: ReactNode;
};

type Item = { element: HTMLElement; range: HTMLElement; x: number; y: number; rotate: number };

const items = new Set<Item>();
let frame = 0;

function update() {
  frame = 0;
  const viewport = window.innerHeight;
  for (const item of items) {
    const rect = item.range.getBoundingClientRect();
    // 0 % : le haut de la zone arrive en bas de la fenêtre ; 100 % : son bas quitte le haut.
    const progress = Math.max(0, Math.min((viewport - rect.top) / (rect.height + viewport), 1)) * 100;
    const step = (speed: number) => (speed >= 0 ? -(progress - 50) : progress - 50) * Math.abs(speed);
    const transforms: string[] = [];
    if (item.y) transforms.push(`translateY(${step(item.y).toFixed(2)}px)`);
    if (item.x) transforms.push(`translateX(${step(item.x).toFixed(2)}px)`);
    if (item.rotate) transforms.push(`rotateZ(${step(item.rotate).toFixed(2)}deg)`);
    item.element.style.transform = transforms.join(" ");
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update);
}

function register(item: Item) {
  if (items.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  items.add(item);
  schedule();
  return () => {
    items.delete(item);
    if (items.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  };
}

/**
 * Effet de défilement (translation / rotation) lié à la position de la zone dans la fenêtre.
 * Reproduit les "motion effects" d'Elementor : amplitude de ±50 px (ou degrés) × vitesse.
 */
export function Parallax({ x = 0, y = 0, rotate = 0, range = "parent", className, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rangeElement =
      range === "parent" ? element.parentElement : (element.parentElement?.closest<HTMLElement>(range) ?? null);
    if (!rangeElement) return;

    return register({ element, range: rangeElement, x, y, rotate });
  }, [x, y, rotate, range]);

  return (
    <div ref={ref} className={cn("parallax", className)}>
      {children}
    </div>
  );
}
