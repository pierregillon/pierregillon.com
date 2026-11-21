import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page non trouvée",
};

export default function NotFound() {
  return (
    <div className="boxed">
      <div className="flex min-h-[50vh] flex-col items-start justify-center gap-5 px-[5%] py-[8%] lg:px-[8%]">
        <h1 className="title-xl text-ink">La page est introuvable.</h1>
        <p className="copy text-black">Il semble que rien n’a été trouvé à cet emplacement.</p>
        <ButtonLink href="/">Retour à l’accueil</ButtonLink>
      </div>
    </div>
  );
}
