import { PostSummary } from "@/models/postSummary";

export const recentPostCap = 99;
export type ordering = "recent" | "popular";

export async function getFeed(
  userId: number,
  orderby: ordering = "recent",
  limit: number = recentPostCap
): Promise<PostSummary[]> {
  const resp = await fetch(
    `/api/forum/posts/feed?userid=${userId}&orderby=${orderby}&limit=${limit}`
  );
  const posts = await resp.json();
  return posts;
}
