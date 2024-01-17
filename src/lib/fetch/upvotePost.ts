export async function upvotePost(userId: number, reactionId: number) {
  const res = await fetch(
    `/api/forum/reaction/${reactionId}/upvote?userid=${userId}`,
    { method: "POST" }
  );
  return res.ok;
}
