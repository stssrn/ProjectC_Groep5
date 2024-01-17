import { PostSummary } from "@/models/postSummary";

export async function fetchUserPosts(
  userId: number,
  username: string,
  limit: number = 100
): Promise<PostSummary[]> {
  const resp = await fetch(
    `/api/forum/gebruiker/${username}?userid=${userId}&limit=${limit}`
  );
  const posts = await resp.json();
  return posts;
}
