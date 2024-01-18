import { users } from "@prisma/client";

export const fetchUser = async (id: Number): Promise<users> => {
  const response = await fetch(`/api/user?id=${id}`, { method: "GET" });
  if (!response.ok) throw new Error("Failed to fetch user data");

  return await response.json();
};
