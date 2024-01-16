import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Reaction, reactionFromDb } from "@/models/reaction";
import { userFromDb } from "@/models/user";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = Number(req.nextUrl.searchParams.get("userid"));
  const content = await req.json();

  const dbReaction = await prisma.reaction.create({
    data: {
      userId,
      content,
      postId: Number(params.id),
    },
    include: {
      user: true,
    },
  });

  const reaction: Reaction = reactionFromDb(
    dbReaction,
    userFromDb(dbReaction.user),
    0,
    false,
  );

  return NextResponse.json(reaction);
}
