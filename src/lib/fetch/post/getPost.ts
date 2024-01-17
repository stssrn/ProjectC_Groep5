import { Post } from "@/models/post";

export async function getPost(userId: number, id: number): Promise<Post> {
  const res = await fetch(`/api/forum/posts/${id}?userid=${userId}`);
  const post = await res.json();
  return post;
}
