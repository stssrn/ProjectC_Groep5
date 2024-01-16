import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PostSummary, postSummaryFromDb } from "@/models/postSummary";
import { userFromDb } from "@/models/user";
import { Reaction, reactionFromDb } from "@/models/reaction";
import { Post } from "@/models/post";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = Number(req.nextUrl.searchParams.get("userid"));
  const id = Number(params.id);
  const dbPost = await prisma.post.findUnique({
    where: {
      id,
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
  if (!dbPost) return new NextResponse(null, { status: 404 });
  const isUpvoted = await prisma.postUpvote.count({
    where: {
      postId: id,
      userId,
    },
  });
  const postSummary = postSummaryFromDb(
    dbPost,
    userFromDb(dbPost.user),
    dbPost._count.PostUpvote,
    dbPost._count.Reaction,
    Boolean(isUpvoted)
  );

  const dbReactions = await prisma.reaction.findMany({
    orderBy: {
      date: "desc",
    },
    where: {
      postId: id,
    },
    include: {
      user: true,
      _count: {
        select: {
          Upvote: true,
        },
      },
    },
  });

  const reactions: Reaction[] = await Promise.all(
    dbReactions.map(async (r) => {
      const isUpvoted = await prisma.upvote.count({
        where: {
          reactionId: r.id,
          userId,
        },
      });
      return reactionFromDb(
        r,
        userFromDb(r.user),
        r._count.Upvote,
        Boolean(isUpvoted)
      );
    })
  );

  const post: Post = { ...postSummary, reactions };

  return NextResponse.json(post);
}
