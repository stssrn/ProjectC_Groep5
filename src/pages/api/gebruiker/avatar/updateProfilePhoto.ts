import prisma from "../../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, profilePhotoUrl } = req.body;

  try {
    await prisma.users.update({
      where: { id: userId },
      data: { profilePhotoUrl },
    });

    res.status(200).json({ message: "Profile photo updated successfully" });
  } catch (error) {
    console.error("Failed to update profile photo:", error);
    res.status(500).json({ message: "Failed to update profile photo" });
  }
}
