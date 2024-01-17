import { Reaction } from "@/models/reaction";

export async function postReaction(
  userId: number,
  postId: number,
  content: string
): Promise<Reaction> {
  const res = await fetch(`/api/forum/posts/${postId}/react?userid=${userId}`, {
    method: "POST",
    body: JSON.stringify(content),
  });

  return await res.json();
}
