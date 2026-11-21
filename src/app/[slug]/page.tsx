import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AngleLeftIcon, AngleRightIcon } from "@/components/icons";
import { PostCard } from "@/components/post-card";
import { renderMarkdown } from "@/lib/markdown";
import { formatPostDate, getAdjacentPosts, getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/lib/site";

// Seuls les articles existants génèrent une page : toute autre URL renvoie la page 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [site.author],
      images: [{ url: post.cover }],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = await renderMarkdown(post.content);
  const { previous, next } = getAdjacentPosts(slug);
  const otherPosts = getAllPosts()
    .filter((other) => other.slug !== slug)
    .slice(0, 2);

  return (
    <article>
      <header className="mt-[3%] px-[8%]">
        <div className="mx-auto flex flex-col gap-2.5 md:max-w-[620px] lg:max-w-[970px]">
          <h1 className="title-lg text-center text-ink">{post.title}</h1>
          <ul className="copy mt-[15px] flex justify-center text-ink">
            <li className="relative px-[15.5px] after:absolute after:inset-y-0 after:right-0 after:border-l after:border-ink">
              <time dateTime={post.date.slice(0, 10)}>{formatPostDate(post.date)}</time>
            </li>
            <li className="px-[15.5px]">{site.author}</li>
          </ul>
        </div>
      </header>

      <div className="mt-[2%] px-[5%] lg:px-[8%]">
        <div className="mx-auto flex flex-col gap-[25px] pb-[25px] md:gap-[50px] md:pb-[50px] lg:max-w-[970px]">
          <div className="overflow-hidden rounded-[5px] border-[7px] border-violet shadow-[10px_10px_20px_0_rgba(0,0,0,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt="" fetchPriority="high" className="block h-auto w-full" />
          </div>

          <div className="post-content" dangerouslySetInnerHTML={{ __html: html }} />

          <nav
            aria-label="Navigation entre les articles"
            className="mt-[3%] flex border-t border-ink pt-[30px] text-[24px] leading-[1.5] font-semibold uppercase"
          >
            <div className="w-1/2">
              {previous && (
                <Link
                  href={`/${previous.slug}/`}
                  rel="prev"
                  className="group flex items-center text-ink hover:text-violet"
                >
                  <AngleLeftIcon className="mr-[15px] size-[30px] text-[#d5d8dc]" />
                  <span className="title-card leading-[1.5]">Précédent</span>
                </Link>
              )}
            </div>
            <div className="w-1/2">
              {next && (
                <Link
                  href={`/${next.slug}/`}
                  rel="next"
                  className="group flex items-center justify-end text-ink hover:text-violet"
                >
                  <span className="title-card leading-[1.5]">Suivant</span>
                  <AngleRightIcon className="ml-[15px] size-[30px] text-[#d5d8dc]" />
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>

      <aside className="mt-[35%] px-[5%] md:mt-[2%] lg:px-[8%]">
        <div className="mx-auto flex flex-col gap-5 md:gap-[50px] lg:max-w-[970px] lg:gap-[100px]">
          <h2 className="title-lg text-center text-ink">Autres articles</h2>
          <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 md:gap-x-[60px] md:gap-y-[71px] lg:gap-y-20">
            {otherPosts.map((other) => (
              <PostCard key={other.slug} post={other} excerptWords={0} showCategory={false} />
            ))}
          </div>
        </div>
      </aside>
    </article>
  );
}
