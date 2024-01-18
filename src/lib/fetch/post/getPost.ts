import { Post } from "@/models/post";

export async function getPost(userId: number, id: number): Promise<Post> {
  const res = await fetch(`/api/forum/posts/${id}?userid=${userId}`);
  if (res.status === 404) throw "Post not found";
  const post = await res.json();
  return post;
}
