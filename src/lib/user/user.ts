export async function getUserById(userId: string | number): Promise<any> {
    const res = await fetch(`/api/user/fetchFromUserId?id=${userId}`);
    if (res.status === 400) throw "Invalid user ID";
    if (res.status === 404) throw "User not found";
    if (res.status === 500) throw "Server error";
    const user = await res.json();
    return user;
}
