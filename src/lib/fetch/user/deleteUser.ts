export const deleteUser = async (id: Number) => {
  try {
    const response = await fetch(`/api/user?id=${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Failed to delete user ${id}`);
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
};
