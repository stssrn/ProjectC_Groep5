import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function PUT(request: Request): Promise<NextResponse> {
  const body = await request.json();
  console.log(body);

  try {
    const updatedUser = await prisma.users.update({
      where: { id: body.id },
      data: body,
    });

    return NextResponse.json(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
