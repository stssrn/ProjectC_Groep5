import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const casussen = await prisma.casus.findMany();
    return NextResponse.json(casussen, { status: 200 });
  } catch (error) {
    console.error("Fetch casussen error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
