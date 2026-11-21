import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { navigation, site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = navigation.map((item) => ({ url: `${site.url}${item.href}` }));
  const posts = getAllPosts().map((post) => ({
    url: `${site.url}/${post.slug}/`,
    lastModified: post.date.slice(0, 10),
  }));
  return [...pages, ...posts];
}
