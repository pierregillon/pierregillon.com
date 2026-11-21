import Link from "next/link";
import { BriefcaseIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons";
import { Deco } from "@/components/motion/deco";
import { site } from "@/lib/site";
import { FooterNav } from "./footer-nav";

const socials = [
  { label: "Linkedin", href: site.social.linkedin, Icon: LinkedinIcon },
  { label: "Github", href: site.social.github, Icon: GithubIcon },
  { label: "Twitter", href: site.social.twitter, Icon: TwitterIcon },
  { label: "Malt", href: site.social.malt, Icon: BriefcaseIcon },
];

const legalLinks = ["Terms", "Privacy", "Support"];

export function SiteFooter() {
  return (
    <footer
      data-parallax-range
      className="relative overflow-hidden bg-violet bg-[url(/images/bg/footer-bg.jpg)] bg-cover bg-center"
    >
      <Deco shape="pattern-2" className="top-[6%] left-[-3%] w-[6%]" reveal="fadeInLeft" y={0.7} />
      <Deco shape="pattern-4" className="bottom-[-6%] left-[-2%] w-[6%]" reveal="rotateIn" rotate={1} />
      <Deco shape="pattern-3" className="right-[-3%] bottom-[8%] w-[6%]" reveal="fadeInRight" y={0.7} />

      <div className="relative z-2 mt-5 mb-10 flex flex-col gap-5 md:mt-10 md:mb-[60px] md:flex-row md:gap-2.5">
        <div className="flex flex-col gap-5 md:w-[40%]">
          <div className="text-center">
            <Link href="/" aria-label="Pierre Gillon – Accueil" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.webp" width={240} height={161} alt="Pierre Gillon" className="h-auto w-[50px]" />
            </Link>
          </div>
          <ul className="flex justify-center gap-5">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-[41.6px] items-center justify-center rounded-full bg-violet-dark text-white transition duration-300 hover:scale-90 hover:text-orange"
                >
                  <span className="sr-only">{label}</span>
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5 px-5 md:w-[19.332%] md:px-0">
          <h4 className="font-heading text-[1.2rem] leading-[1.4] font-medium text-white uppercase">Liens</h4>
          <FooterNav />
        </div>

        <div className="flex flex-col gap-5 px-5 md:w-[40%] md:px-0">
          <h4 className="font-heading text-[1.2rem] leading-[1.4] font-medium text-white uppercase">Contact</h4>
          <p className="copy">
            <a href={site.calendly} className="text-white hover:text-orange">
              Prendre rendez-vous
            </a>
          </p>
        </div>
      </div>

      <div className="relative z-2 flex flex-col gap-2.5 border-t border-violet-soft px-5 py-2.5 md:flex-row md:py-[30px]">
        <p className="font-open flex-1 text-center text-[0.9rem] leading-[1.2] text-white uppercase md:text-left">
          Pierre Gillon © 2025. Tout droit réservé.
        </p>
        <ul className="font-open flex flex-1 justify-center gap-[25px] text-[0.9rem] leading-[1.2] md:justify-end">
          {legalLinks.map((label) => (
            <li key={label}>
              <a href="#" className="text-violet-soft hover:text-white">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
