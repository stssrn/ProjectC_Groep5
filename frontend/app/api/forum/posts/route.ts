import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Post } from "@/lib/posts";
import { Account } from "@/lib/accounts";

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get("limit")) ?? 10;
  const posts = await prisma.post.findMany({
    take: limit,
    orderBy: {
      id: "desc",
    },
    include: {
      user: true,
      _count: {
        select: {
          upvotes: true,
        }
      }
    },
  });

  return NextResponse.json(
    posts.map(
      (p): Post => ({
        id: p.id,
        category: "Overig",
        content: p.content,
        likes: p._count.upvotes,
        poster: {
          id: p.user.id,
          firstName: p.user.firstName,
          lastName: p.user.lastName,
          points: p.user.points,
          firstLogin: p.user.firstLogin,
          username: p.user.username,
          isAdmin: p.user.isAdmin,
          isModerator: p.user.isAdmin,
          creationDate: p.user.registationDate,
        },
        date: new Date(),
      })
    )
  );
}

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
    const createdPost: Post = {
      category: "Overig",
      id: forum.post.id,
      content: forum.post.content,
      date: new Date(),
      likes: 0,
      poster: {
        id: forum.user.id,
        firstName: forum.user.firstName,
        lastName: forum.user.lastName,
        points: forum.user.points,
        firstLogin: forum.user.firstLogin,
        username: forum.user.username,
        isAdmin: forum.user.isAdmin,
        isModerator: forum.user.isAdmin,
        creationDate: forum.user.registationDate,
      },
    };
    return NextResponse.json(createdPost);
  } catch {
    return NextResponse.error();
  }
}
