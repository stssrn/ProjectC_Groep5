import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request): Promise<NextResponse> {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get("userId");

    if (!userId || isNaN(Number(userId))) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    try {
        // Find the first quiz that the user hasn't finished or hasn't started yet
        const quiz = await prisma.quiz.findFirst({
            where: {
                NOT: {
                    QuizUser: {
                        some: {
                            userId: Number(userId),
                            isCompleted: true,
                        },
                    },
                },
            },
            orderBy: {
                id: 'asc', // Order by quiz ID in ascending order
            },
        });

        if (!quiz) {
            return NextResponse.json({ message: "All quizzes are completed" }, { status: 404 });
        }

        return NextResponse.json({ quiz }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
