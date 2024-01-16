import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId, newPassword } = body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
