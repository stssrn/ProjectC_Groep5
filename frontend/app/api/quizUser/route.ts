import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

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
            try {
                // Create a new AgendaUser entry
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
            } catch (error) {
                console.error("Create bugUser error:", error);
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
        console.error("Post error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
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