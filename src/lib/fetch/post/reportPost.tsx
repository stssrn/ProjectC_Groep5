export async function reportPost(userId: number, postId: number, reason: string) {
  const res = await fetch(
    `/api/forum/posts/${postId}/report?userid=${userId}`,
    {
      method: "PUT",
      body: JSON.stringify(reason),
    }
  );
  return res;
}
