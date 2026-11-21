import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Carte de base du site : fond uni, coins très peu arrondis. */
function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("group/card rounded-[3px] bg-card text-card-foreground transition-colors duration-300", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("title-card text-[#333]", className)} {...props} />;
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("copy-sm text-muted-foreground", className)} {...props} />;
}

export { Card, CardContent, CardTitle };
