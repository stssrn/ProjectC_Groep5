import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(): Promise<NextResponse> {
    try {
        const quizes = await prisma.quiz.findMany();
        return NextResponse.json(quizes, { status: 200 });
    } catch (error) {
        console.error("Fetch quizes error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
  
