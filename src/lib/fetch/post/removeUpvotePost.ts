export async function removeUpvotePost(userId: number, postId: number) {
  const res = await fetch(
    `/api/forum/posts/${postId}/remove-upvote?userid=${userId}`,
    { method: "DELETE" }
  );
  return res.ok;
}
