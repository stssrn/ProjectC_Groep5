export async function deletePost(postId: number) {
    const res = await fetch(`/api/forum/posts/${postId}/delete`, {
        method: "DELETE",
    });
    return res.ok;
}
