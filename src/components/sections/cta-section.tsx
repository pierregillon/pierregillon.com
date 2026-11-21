import { Reveal } from "@/components/motion/reveal";
import { SectionTitle } from "@/components/section-title";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/site";

/** Bandeau d'appel à l'action "Prenons un café" (cadre orange). */
export function CtaSection() {
  return (
    <section className="border-[10px] border-[#fb944c] bg-white">
      <div className="boxed px-[30px] py-[calc(5%+30px)]">
        <div className="mx-auto flex max-w-[985px] flex-col gap-5">
          <Reveal animation="fadeInUp">
            <SectionTitle lead="Intéressé ? Prenons un" accent="café !" />
          </Reveal>
          <Reveal animation="fadeInUp">
            <p className="copy text-center text-ink">
              Si mon profil vous intéresse et que vous souhaitez en savoir plus, prenez un rendez-vous directement
              dans mon calendrier. Je serais heureux d&apos;échanger avec vous.
            </p>
          </Reveal>
          <ButtonLink href={site.calendly} target="_blank" className="self-center">
            Prendre rendez-vous
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
