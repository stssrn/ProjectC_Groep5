import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const requestBody = await request.json();
  const { resetToken } = requestBody;

  if (!resetToken) {
    return NextResponse.json(
      { message: "Invalid token provided" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.users.findFirst({
      where: {
        resetToken: resetToken,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "Token is valid" }, { status: 200 });
  } catch (error) {
    console.error("Error validating reset token:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
