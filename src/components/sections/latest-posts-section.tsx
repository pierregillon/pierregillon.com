import { Reveal } from "@/components/motion/reveal";
import { PostCard } from "@/components/post-card";
import { SectionTitle } from "@/components/section-title";
import { ButtonLink } from "@/components/ui/button";
import { getAllPosts } from "@/lib/posts";

/** Section "Mes derniers articles" : les trois articles les plus récents. */
export function LatestPostsSection() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section>
      <div className="boxed">
        <div className="m-[5%] flex flex-col gap-5">
          <Reveal animation="fadeInUp">
            <SectionTitle lead="Mes derniers" accent="articles" />
          </Reveal>
          <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 md:gap-x-5 md:gap-y-[71px] lg:grid-cols-3 lg:gap-y-0">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} excerptWords={30} />
            ))}
          </div>
          <ButtonLink href="/blog/" variant="secondary" size="lg" className="self-center">
            Voir tous les Articles
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
