# pierregillon.com

Site vitrine et blog de Pierre Gillon, reconstruit en site **100 % statique** (auparavant WordPress + Elementor).

- [Next.js 16](https://nextjs.org) (App Router, export statique) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) et [shadcn/ui](https://ui.shadcn.com) (thème personnalisé aux couleurs du site)
- Articles de blog en Markdown, coloration syntaxique faite à la compilation ([Shiki](https://shiki.style))
- Aucune base de données, aucun serveur : le résultat est un simple dossier de fichiers HTML/CSS/JS

## Commandes

```bash
npm install     # installer les dépendances
npm run dev     # développement sur http://localhost:3000
npm run build   # génère le site statique dans out/
npm run lint    # vérification ESLint
```

## Déploiement

`npm run build` produit le dossier `out/`, à publier tel quel sur n'importe quel hébergement statique
(Cloudflare Pages, Netlify, GitHub Pages, Vercel, OVH…). La page `out/404.html` sert de page d'erreur.

Les URLs de l'ancien site sont conservées (`/mon-offre/`, `/blog/`, `/about/`, `/<slug-de-l-article>/`).

## Organisation

```
content/posts/        Articles du blog (un fichier Markdown par article)
public/images/        Images optimisées (WebP) : blog/, themes/, clients/, shapes/, bg/
src/app/              Pages : accueil, mon-offre, about, blog, [slug] (article), 404
src/components/
  layout/             En-tête et pied de page
  motion/             Animations : Reveal (entrée au scroll), Parallax, Deco (formes décoratives)
  sections/           Sections réutilisées (tarifs, clients, appel à l'action, derniers articles…)
  ui/                 Composants shadcn/ui personnalisés (boutons, cartes)
src/lib/              Lecture des articles, rendu Markdown, constantes du site
```

Les couleurs, typographies et animations sont définies dans `src/app/globals.css`.

## Écrire un article

Créer `content/posts/mon-article.md` : le nom du fichier devient l'URL (`/mon-article/`).

```markdown
---
title: Titre de l'article
date: '2026-01-15'
category: Clean code
cover: /images/blog/ma-couverture.webp
excerpt: Résumé affiché dans les listes d'articles.
---

Texte en **Markdown**…
```

Éléments de mise en forme disponibles en plus du Markdown standard :

````markdown
```csharp {3,5-7}
// Bloc de code coloré ; les lignes 3 et 5 à 7 sont surlignées
```

<figure class="align-center">
  <img src="/images/blog/schema.webp" alt="" width="443" height="514" />
  <figcaption>Légende de l'image</figcaption>
</figure>

<div class="callout" style="background-color:#eaf9ff">

**Note** : encadré coloré (le Markdown fonctionne à l'intérieur).

</div>

<blockquote class="large">

Citation mise en avant

</blockquote>
````

Les images sont à déposer dans `public/images/blog/` (WebP de préférence, 1280 px de large suffisent pour une couverture).
