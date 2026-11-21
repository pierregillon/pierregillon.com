import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionTitleProps = {
  /** Première partie du titre (couleur sombre, ou blanche avec `light`) */
  lead: ReactNode;
  /** Seconde partie, mise en avant en orange */
  accent: ReactNode;
  as?: "h1" | "h2" | "h3";
  /** Texte blanc pour les fonds violets */
  light?: boolean;
  className?: string;
};

/** Titre bicolore en capitales, signature visuelle du site. */
export function SectionTitle({ lead, accent, as: Tag = "h2", light, className }: SectionTitleProps) {
  return (
    <Tag className={cn("title-xl py-2.5 text-center", className)}>
      <span className={light ? "text-white" : "text-ink"}>{lead}</span>{" "}
      <span className="text-orange">{accent}</span>
    </Tag>
  );
}
