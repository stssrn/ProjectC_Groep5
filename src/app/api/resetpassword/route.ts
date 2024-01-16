import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const requestBody = await request.json();
  const { resetToken, password } = requestBody;

  if (!resetToken || !password) {
    return NextResponse.json(
      { message: "Reset token and password are required." },
      { status: 400 }
    );
  }

  const user = await prisma.users.findFirst({
    where: {
      resetToken,
      resetTokenExpiry: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "This token is either invalid or expired." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.users.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return NextResponse.json(
    { message: "Your password has been reset." },
    { status: 200 }
  );
}
