import { PostSummary } from "@/models/postSummary";

export async function fetchUserPosts(
  userId: number,
  username: string,
  limit: number = 100
): Promise<PostSummary[]> {
  const res = await fetch(
    `/api/forum/gebruiker/${username}?userid=${userId}&limit=${limit}`
  );
  const posts = await res.json();
  return posts;
}
