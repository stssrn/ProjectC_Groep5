import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }
  console.log("data", session.user);
  console.log("GET API", session);
  return NextResponse.json({ authenticated: !!session, user: session.user });
}
