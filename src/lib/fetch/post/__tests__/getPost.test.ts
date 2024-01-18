import { getPost } from "../getPost";

test("Fetching an non-existant post", async () => {
    await expect(getPost(0, -1)).rejects.toBe("Post not found");
});

test("Fetching an existing post", async () => {
    await expect(getPost(0, 1)).resolves.toHaveProperty("content");
});
