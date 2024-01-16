import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (request.method !== "POST") {
      return new NextResponse(
        JSON.stringify({ message: "Method Not Allowed" }),
        { status: 405 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new NextResponse(
        JSON.stringify({ message: "Incorrecte Inloggegevens" }),
        { status: 401 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Succesvol Ingelogd", userId: user.id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
