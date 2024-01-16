import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = Number(req.nextUrl.searchParams.get("userid"));
  const postId = Number(params.id);

  try {
    await prisma.postUpvote.delete({
      where: {
        postId_userId: { postId, userId },
      },
    });
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse("Post isn't upvoted", { status: 403 });
  }
}
