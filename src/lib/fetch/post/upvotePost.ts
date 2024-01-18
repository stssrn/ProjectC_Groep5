export async function upvotePost(userId: number, postId: number) {
  const res = await fetch(
    `/api/forum/posts/${postId}/upvote?userid=${userId}`,
    { method: "POST" }
  );
  return res.ok;
}
