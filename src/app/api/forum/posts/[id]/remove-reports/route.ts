import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    const id = Number(params.id);

    await prisma.reportedPost.deleteMany({
        where: {
            postId: id
        }
    })

    return NextResponse.json("Reports removed");
}