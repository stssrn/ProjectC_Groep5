import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    const contentType = request.headers.get("content-type");

    if (!filename) {
      return NextResponse.json(
        { message: "Missing filename" },
        { status: 400 }
      );
    }

    if (!request.body) {
      return NextResponse.json({ message: "Missing file" }, { status: 400 });
    }

    const allowedContentTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!contentType || !allowedContentTypes.includes(contentType)) {
      return NextResponse.json(
        { message: "Invalid file type" },
        { status: 400 }
      );
    }

    const blob = await put(filename, request.body, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Error uploading file" },
      { status: 500 }
    );
  }
}
