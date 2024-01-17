import { PostSummary } from "@/models/postSummary";

export async function submitPost(
  userId: number,
  content: string
): Promise<PostSummary> {
  const resp = await fetch(`/api/forum/posts/create?userid=${userId}`, {
    method: "POST",
    body: JSON.stringify(content),
  });
  return resp.json();
}
