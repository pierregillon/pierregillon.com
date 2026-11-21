import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  /** Nom du fichier sans extension : c'est aussi l'URL de l'article (/slug/) */
  slug: string;
  title: string;
  /** Date de publication : AAAA-MM-JJ, ou AAAA-MM-JJTHH:MM:SS pour départager deux articles du même jour */
  date: string;
  /** Catégorie affichée sur la vignette */
  category: string;
  categories: string[];
  /** Image de couverture (chemin dans /public) */
  cover: string;
  /** Résumé affiché dans les listes d'articles */
  excerpt: string;
};

export type Post = PostMeta & {
  /** Contenu Markdown brut */
  content: string;
};

let cache: Post[] | undefined;

function loadPosts(): Post[] {
  if (cache) return cache;

  const posts = fs
    .readdirSync(POSTS_DIRECTORY)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIRECTORY, file), "utf8"));
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 19) : String(data.date);
      const categories: string[] = data.categories ?? (data.category ? [data.category] : []);
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title),
        date,
        category: String(data.category ?? categories[0] ?? ""),
        categories,
        cover: String(data.cover),
        excerpt: String(data.excerpt ?? ""),
        content,
      } satisfies Post;
    })
    // Du plus récent au plus ancien
    .sort((a, b) => b.date.localeCompare(a.date));

  if (process.env.NODE_ENV === "production") cache = posts;
  return posts;
}

/** Tous les articles, du plus récent au plus ancien. */
export function getAllPosts(): PostMeta[] {
  return loadPosts();
}

export function getPost(slug: string): Post | undefined {
  return loadPosts().find((post) => post.slug === slug);
}

/** Articles précédent (plus ancien) et suivant (plus récent) d'un article. */
export function getAdjacentPosts(slug: string): { previous?: PostMeta; next?: PostMeta } {
  const posts = loadPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return { previous: posts[index + 1], next: posts[index - 1] };
}

/** Tronque un résumé à `count` mots, comme le faisait le thème WordPress. */
export function truncateWords(text: string, count: number) {
  const words = text.trim().split(/ +/);
  return words.length <= count ? text.trim() : words.slice(0, count).join(" ");
}

const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/** "2019-08-23" → "août 23, 2019" (format d'affichage de l'ancien site). */
export function formatPostDate(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}
