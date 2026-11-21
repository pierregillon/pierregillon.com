export const site = {
  name: "Pierre Gillon",
  tagline: "Software Craftsman as a Service ⚡︎ Architect ⚡︎ .NET Expert",
  url: "https://pierregillon.com",
  author: "Pierre Gillon",
  calendly: "https://calendly.com/pierregillon/30min",
  social: {
    linkedin: "https://www.linkedin.com/in/pierregillon/",
    github: "https://github.com/pierregillon/",
    twitter: "https://twitter.com/_pgillon/",
    malt: "https://www.malt.fr/profile/pierregillon",
  },
} as const;

export const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Mon offre", href: "/mon-offre/" },
  { label: "Blog", href: "/blog/" },
  { label: "A propos", href: "/about/" },
] as const;

/** Vrai si `href` correspond à la page courante (avec ou sans slash final). */
export function isCurrentPage(pathname: string, href: string) {
  const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);
  return normalize(pathname) === normalize(href);
}
