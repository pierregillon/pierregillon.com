import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="boxed">
      <div className="flex flex-col gap-5 p-[3%]">
        <h1 className="title-xl text-ink">Tous les articles</h1>
        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 md:gap-x-5 md:gap-y-[71px] lg:grid-cols-3 lg:gap-5">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} excerptWords={20} />
          ))}
        </div>
      </div>
    </div>
  );
}
