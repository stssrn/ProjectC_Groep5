import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PostSummary, postSummaryFromDb } from "@/models/postSummary";
import { userFromDb } from "@/models/user";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const limit = Number(req.nextUrl.searchParams.get("limit")) ?? 10;
  const userId = Number(req.nextUrl.searchParams.get("userid"));
  const dbPosts = await prisma.post.findMany({
    take: limit,
    where: {
      user: {
        username: params.username,
      }
    },
    orderBy: {
      date: "desc",
    },
    include: {
      user: true,
      _count: {
        select: {
          PostUpvote: true,
          Reaction: true,
        },
      },
    },
  });

  const posts: PostSummary[] = await Promise.all(
    dbPosts.map(async (p) => {
      const isUpvoted = await prisma.postUpvote.count({
        where: {
          postId: p.id,
          userId,
        },
      });
      return postSummaryFromDb(
        p,
        userFromDb(p.user),
        p._count.PostUpvote,
        p._count.Reaction,
        Boolean(isUpvoted)
      );
    })
  );

  return NextResponse.json(posts);
}
