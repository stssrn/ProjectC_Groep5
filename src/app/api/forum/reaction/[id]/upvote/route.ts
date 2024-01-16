import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = Number(req.nextUrl.searchParams.get("userid"));
  const reactionId = Number(params.id);

  try {
    await prisma.upvote.create({
      data: {
        userId,
        reactionId,
      },
    });
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse("Reaction is already upvoted", { status: 403 });
  }
}
