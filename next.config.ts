import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site 100 % statique : `next build` génère le dossier `out/`, déployable sur n'importe quel hébergeur.
  output: "export",
  // Conserve les URLs de l'ancien site WordPress (/mon-offre/, /blog/, /mon-article/).
  trailingSlash: true,
  images: {
    // Pas de serveur d'optimisation d'images en statique : les images sont pré-optimisées (WebP) dans /public.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
