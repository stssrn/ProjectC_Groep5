import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = Number(req.nextUrl.searchParams.get("userid"));
  const reactionId = Number(params.id);

  try {
    await prisma.upvote.delete({
      where: {
        userId_reactionId: { userId, reactionId },
      },
    });
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse("Reaction isn't upvoted", { status: 403 });
  }
}
