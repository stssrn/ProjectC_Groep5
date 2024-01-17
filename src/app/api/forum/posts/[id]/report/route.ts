import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = Number(params.id);
  const reportedBy = Number(req.nextUrl.searchParams.get("userid"))
  const reason = await req.json();

  const report = await prisma.reportedPost.create({
    data: {
      reportedBy,
      postId,
      reason,
    }
  });

  return NextResponse.json(report);
}
