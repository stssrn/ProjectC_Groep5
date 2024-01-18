import { getUserById } from "@/lib/user/user";

test("Fetching a non-existent user", async () => {
    await expect(getUserById(-1)).rejects.toBe("User not found");
});

test("Fetching a user with wrong id type", async () => {
    await expect(getUserById("test")).rejects.toBe("Invalid user ID");
});

test("Fetching a user with correct structure", async () => {
    const user = await getUserById(2);

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("password");
    expect(user).toHaveProperty("bio");
    expect(user).toHaveProperty("points");
    expect(user).toHaveProperty("profilePhoto");
    expect(user).toHaveProperty("profilePhotoUrl");
    expect(user).toHaveProperty("firstName");
    expect(user).toHaveProperty("lastName");
    expect(user).toHaveProperty("registationDate");
    expect(user).toHaveProperty("firstLogin");
    expect(user).toHaveProperty("isAdmin");
    expect(user).toHaveProperty("isForumMod");
    expect(user).toHaveProperty("resetToken");
    expect(user).toHaveProperty("resetTokenExpiry");
    expect(user).toHaveProperty("fullName");
    });
