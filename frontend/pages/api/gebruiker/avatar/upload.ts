import { put } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const filename = req.query.filename as string;
    const contentType = req.query.contentType as string;

    const allowedContentTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedContentTypes.includes(contentType)) {
      res.status(400).json({ message: "Invalid file type" });
      return;
    }

    const blob = await put(filename, req, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

export default handler;
