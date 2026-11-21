import type { ComponentType, ReactNode, SVGProps } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const colors = {
  violet: { icon: "bg-violet", hover: "hover:bg-violet-alt" },
  orange: { icon: "bg-orange", hover: "hover:bg-orange" },
  sky: { icon: "bg-sky", hover: "hover:bg-sky" },
} as const;

type InfoBoxProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: keyof typeof colors;
  title: string;
  children: ReactNode;
  className?: string;
  /** Marges latérales du texte réduites (15 px au lieu de 20 px) */
  tight?: boolean;
};

/** Carte "pictogramme + titre + texte" : au survol, elle prend la couleur de son pictogramme. */
export function InfoBox({ icon: Icon, color, title, children, className, tight }: InfoBoxProps) {
  return (
    <Card className={cn("flex flex-1 flex-col pt-10 text-center", colors[color].hover, className)}>
      <div
        className={cn("flex size-[90px] items-center justify-center self-center rounded-full", colors[color].icon)}
      >
        <Icon className="size-10 text-white" />
      </div>
      <div className={cn("pb-10", tight ? "px-[15px]" : "px-5")}>
        <CardTitle className="mt-10 transition-colors duration-100 group-hover/card:text-white">{title}</CardTitle>
        <CardContent className="m-2.5 transition-colors duration-100 group-hover/card:text-white">
          {children}
        </CardContent>
      </div>
    </Card>
  );
}
