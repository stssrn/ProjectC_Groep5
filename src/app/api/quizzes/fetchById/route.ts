import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request): Promise<NextResponse> {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");

    try {
        let quiz;

        if (id) {
            // If id parameter is provided, find quiz by id
            if (isNaN(Number(id))) {
                return NextResponse.json({ message: "Invalid quiz ID" }, { status: 400 });
            }
            quiz = await prisma.quiz.findUnique({
                where: {
                    id: Number(id),
                },
            });
        } else {
            // Find the first quiz that the user hasn't finished or hasn't started yet
            if (!userId || isNaN(Number(userId))) {
                return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
            }

            quiz = await prisma.quiz.findFirst({
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
        }

        if (!quiz) {
            return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
        }

        return NextResponse.json({ quiz }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
