"use client";
export async function removeReportsFromPost(postId: number) {
  const res = await fetch(`/api/forum/posts/${postId}/remove-reports`, {
    method: "DELETE",
  });
  return res;
}
