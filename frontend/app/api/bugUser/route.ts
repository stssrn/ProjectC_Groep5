import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request: Request): Promise<NextResponse> {
    try {
        if (request.method === 'GET') {
            const searchParams = new URL(request.url).searchParams;
            const userId = searchParams.get("userId");
            const bugId = searchParams.get("bugId");

            if (!searchParams) {
                return new NextResponse(
                    JSON.stringify({ message: 'Missing IDs in the request body' }),
                    { status: 400 }
                );
            }
            const bugUserEntry = await prisma.bugUser.findFirst({
                where: {
                    userId: Number(userId),
                    bugId: Number(bugId),
                },
            });
            if (!bugUserEntry) {
                return new NextResponse(
                    JSON.stringify({ message: 'No entries found', entry: null })

                );
            }

            return NextResponse.json({ entry: bugUserEntry }, { status: 200 });
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
            const { bugId, userId } = body;
            try {
                // Create a new AgendaUser entry
                const newBugUser = await prisma.bugUser.create({
                    data: { bugId, userId },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully created a new bugUser entry",
                        agendaUserId: newBugUser.id,
                        eventId: newBugUser.bugId,
                        userId: newBugUser.userId,
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
            const { userId, bugId } = body;

            try {
                // Find the AgendaUser entry based on userId and eventId
                const bugUserEntry = await prisma.bugUser.findFirst({
                    where: { userId, bugId },
                });

                if (!bugUserEntry) {
                    return new NextResponse(
                        JSON.stringify({ message: 'bugUser entry not found' }),
                        { status: 404 }
                    );
                }

                // Delete the AgendaUser entry
                await prisma.bugUser.delete({
                    where: { id: bugUserEntry.id },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully deleted the bugUser entry",
                        deletedBugUserId: bugUserEntry.id,
                        bugId: bugUserEntry.bugId,
                        userId: bugUserEntry.userId,
                    }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Delete bugUser error:", error);
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

