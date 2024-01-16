import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PostSummary, postSummaryFromDb } from "@/models/postSummary";
import { userFromDb } from "@/models/user";

export async function POST(req: NextRequest) {
  const userId = Number(req.nextUrl.searchParams.get("userid"));
  const content = await req.json();
  try {
    const post = await prisma.post.create({
      data: {
        content,
        userId,
        title: content,
      },
    });
    const forum = await prisma.forum.create({
      data: {
        userId,
        postId: post.id,
      },
      include: {
        post: true,
        user: true,
      },
    });

    const createdPost: PostSummary = postSummaryFromDb(
      forum.post,
      userFromDb(forum.user),
      0,
      0,
      false,
    );

    return NextResponse.json(createdPost);
  } catch {
    return NextResponse.error();
  }
}
