export async function removeUpvoteReaction(userId: number, reactionId: number) {
  const res = await fetch(
    `/api/forum/reaction/${reactionId}/remove-upvote?userid=${userId}`,
    { method: "DELETE" }
  );
  return res.ok;
}
