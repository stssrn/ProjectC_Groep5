import prisma from "@/lib/prisma";
import { mailer } from "@/lib/nodemailer";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { email } = await request.json();

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { message: "this user does not exist" },
      { status: 400 }
    );
  }

  const resetToken = randomBytes(3).toString("hex").slice(0, 6);
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 uur vanaf nu wordt opgeslagen in UTC tijd

  await prisma.users.update({
    where: { email },
    data: { resetToken, resetTokenExpiry },
  });

  await mailer.sendMail({
    to: email,
    subject: "Password Reset",
    text: `Your password reset code is: ${resetToken}`,
    html: `<p>Your password reset code is: <strong>${resetToken}</strong></p>`,
  });

  return NextResponse.json(
    { message: "Password reset email sent." },
    { status: 200 }
  );
}
