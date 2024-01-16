import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = Number(req.nextUrl.searchParams.get("userid"));
  const postId = Number(params.id);

  try {
    await prisma.postUpvote.create({
      data: {
        userId,
        postId,
      },
    });
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse("Post is already upvoted", { status: 403 });
  }
}
