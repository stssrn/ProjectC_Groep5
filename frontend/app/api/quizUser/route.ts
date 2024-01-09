import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { equal } from 'assert';

export async function GET(request: Request): Promise<NextResponse> {
    try {
        if (request.method === 'GET') {
            const searchParams = new URL(request.url).searchParams;
            const userId = searchParams.get("userId");
            const quizId = searchParams.get("bugId");
            const id = searchParams.get("id");
            if (!searchParams) {
                return new NextResponse(
                    JSON.stringify({ message: 'Missing IDs in the request body' }),
                    { status: 400 }
                );
            }
            if (Number(id) === 0) {
                const quizUserData = await prisma.quizUser.findMany();

                return NextResponse.json({ quizUserData: quizUserData }, { status: 200 });
            }

            const quizUserEntry = await prisma.quizUser.findFirst({
                where: {
                    userId: Number(userId),
                    quizId: Number(quizId),
                },
            });
            if (!quizUserEntry) {
                return new NextResponse(
                    JSON.stringify({ message: 'No entries found', entry: null })

                );
            }

            return NextResponse.json({ entry: quizUserEntry }, { status: 200 });
        } else {
            return new NextResponse(
                JSON.stringify({ message: 'Method error' }),
                { status: 405 }
            );
        }
    } catch (error: any) {
        console.error("Get error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        if (request.method === "POST") {
            const body = await request.json();
            const { quizId, userId, isCompleted, pointsScored } = body;

            // Check if an entry already exists for the given user and quiz
            const existingQuizUser = await prisma.quizUser.findFirst({
                where: {
                    userId: Number(userId),
                    quizId: Number(quizId),
                },
            });

            if (existingQuizUser) {
                // Entry already exists, you may want to update it or return an error
                return new NextResponse(
                    JSON.stringify({
                        message: 'QuizUser entry already exists',
                        quizUserId: existingQuizUser.id
                    }),
                    { status: 409 } // 409 Conflict status code for resource conflict
                );
            }

            // Create a new QuizUser entry
            const newQuizUser = await prisma.quizUser.create({
                data: { quizId, userId, isCompleted, pointsScored },
            });

            return new NextResponse(
                JSON.stringify({
                    quizUserId: newQuizUser.id,
                    quizId: newQuizUser.quizId,
                    userId: newQuizUser.userId,
                    isCompleted: newQuizUser.isCompleted,
                    pointsScored: newQuizUser.pointsScored,
                }),
                { status: 201 } // 201 Created status code for successful creation
            );
        } else {
            return new NextResponse(
                JSON.stringify({ message: 'Method error' }),
                { status: 405 }
            );
        }
    } catch (error) {
        console.error("Create quizUser error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

export async function PUT(request: Request): Promise<NextResponse> {
    try {
        if (request.method === 'PUT') {
            const body = await request.json();
            const { id, userId, quizId, earnedPoints } = body;

            // Find the existing QuizUser entry
            const existingQuizUser = await prisma.quizUser.findFirst({
                where: { id, userId, quizId },
            });

            if (!existingQuizUser) {
                return new NextResponse(
                    JSON.stringify({ message: 'QuizUser entry not found' }),
                    { status: 404 }
                );
            }

            // Update the QuizUser entry
            const updatedQuizUser = await prisma.quizUser.update({
                where: { id },
                data: {
                    pointsScored: earnedPoints,
                    isCompleted: true,
                },
            });

            return new NextResponse(
                JSON.stringify(updatedQuizUser),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            return new NextResponse(
                JSON.stringify({ message: 'Method error' }),
                { status: 405, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error('Update quizUser error:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        if (request.method === "DELETE") {
            const body = await request.json();
            const { userId, quizId } = body;

            try {
                // Find the AgendaUser entry based on userId and eventId
                const quizUserEntry = await prisma.quizUser.findFirst({
                    where: { userId, quizId },
                });

                if (!quizUserEntry) {
                    return new NextResponse(
                        JSON.stringify({ message: 'quizUser entry not found' }),
                        { status: 404 }
                    );
                }

                // Delete the AgendaUser entry
                await prisma.quizUser.delete({
                    where: { id: quizUserEntry.id },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully deleted the quizUser entry",
                        deletedQuizUserId: quizUserEntry.id,
                        quizId: quizUserEntry.quizId,
                        userId: quizUserEntry.userId,
                    }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Delete quizUser error:", error);
                return new NextResponse(JSON.stringify({ message: "Server error" }), {
                    status: 500,
                });
            }
        } else {
            return new NextResponse(
                JSON.stringify({ message: 'Method error' }),
                { status: 405 }
            );
        }
    } catch (error) {
        console.error("Delete error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}