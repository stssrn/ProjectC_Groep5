import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: Request): Promise<NextResponse> {
    const searchParams = new URL(request.url).searchParams;
    const quizId = searchParams.get("id");
    console.log("id has been received, id is: " + quizId)
    if (!quizId || isNaN(Number(quizId))) {
        return NextResponse.json({ message: "Invalid quiz ID" }, { status: 400 });
    }
    console.log("Invalid quiz ID")
    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: Number(quizId) },
        });

        if (!quiz) {
            return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
        }

        // const id = quiz.id
        // const title = quiz.title;
        // const questions = quiz.questions;
        // const points = quiz.points

        return NextResponse.json({ quiz }, { status: 200 });

    } catch (error) {
        console.error("Fetch quiz error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
