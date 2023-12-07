import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const userId = req.query.id;

    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const user = await prisma.users.findUnique({
        where: { id: Number(userId) },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const fullName = `${user.firstName} ${user.lastName}`;
      res.status(200).json({ ...user, fullName });
    } catch (error) {
      console.error("Fetch user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
