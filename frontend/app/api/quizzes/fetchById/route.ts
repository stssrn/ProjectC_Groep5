import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request): Promise<NextResponse> {
    const searchParams = new URL(request.url).searchParams;
    const quizId = searchParams.get("id");

    if (!quizId || isNaN(Number(quizId))) {
        return NextResponse.json({ message: "Invalid quiz ID" }, { status: 400 });
    }

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: Number(quizId) },
        });

        if (!quiz) {
            return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
        }

        return NextResponse.json({ quiz }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
