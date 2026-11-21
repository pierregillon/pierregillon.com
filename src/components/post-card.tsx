import Link from "next/link";
import { truncateWords, type PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

type PostCardProps = {
  post: PostMeta;
  /** Nombre de mots du résumé ; 0 pour ne pas l'afficher */
  excerptWords?: number;
  /** Affiche la pastille de catégorie sur l'image */
  showCategory?: boolean;
  className?: string;
};

/** Vignette d'article : image, catégorie, titre et début du résumé. */
export function PostCard({ post, excerptWords = 30, showCategory = true, className }: PostCardProps) {
  const href = `/${post.slug}/`;

  return (
    <article className={cn("relative flex flex-col overflow-hidden rounded-[3px] bg-white", className)}>
      <Link href={href} tabIndex={-1} className="relative mb-5 block aspect-2/1 overflow-hidden md:aspect-5/4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </Link>
      {showCategory && post.category && (
        <div className="absolute top-0 right-0 m-[5px] bg-violet px-[1.2em] py-[0.6em] text-xs leading-[1.4] font-semibold text-white capitalize">
          {post.category}
        </div>
      )}
      <h3 className="title-card mb-[9px] uppercase md:mb-2">
        <Link href={href} className="text-ink">
          {post.title}
        </Link>
      </h3>
      {excerptWords > 0 && (
        <p className="copy mb-[25px] text-[#777]">{truncateWords(post.excerpt, excerptWords)}</p>
      )}
    </article>
  );
}
