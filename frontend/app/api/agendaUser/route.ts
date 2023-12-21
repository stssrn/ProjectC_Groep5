import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request: Request): Promise<NextResponse> {
    try {
        if (request.method === 'GET') {
            const searchParams = new URL(request.url).searchParams;
            const userId = searchParams.get("userId");
            const eventId = searchParams.get("eventId");
            if (!searchParams) {
                return new NextResponse(
                    JSON.stringify({ message: 'Missing IDs in the request body' }),
                    { status: 400 }
                );
            }
            const agendaUserEntry = await prisma.agendaUser.findFirst({
                where: {
                    userId: Number(userId),
                    eventId: Number(eventId),
                },
            });
            if (!agendaUserEntry) {
                return new NextResponse(
                    JSON.stringify({ message: 'No entries found', entry: null })

                );
            }

            return NextResponse.json({ entry: agendaUserEntry }, { status: 200 });
        } else {
            return new NextResponse(
                JSON.stringify({ message: 'Method error' }),
                { status: 405 }
            );
        }
    } catch (error: any) {
        console.error("Fetch agenda user error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        if (request.method === "POST") {
            const body = await request.json();
            const { eventId, userId } = body;

            try {
                // Create a new AgendaUser entry
                const newAgendaUser = await prisma.agendaUser.create({
                    data: { eventId, userId },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully created a new AgendaUser entry",
                        agendaUserId: newAgendaUser.id,
                        eventId: newAgendaUser.eventId,
                        userId: newAgendaUser.userId,
                    }),
                    { status: 201 } // 201 Created status code for successful creation
                );
            } catch (error) {
                console.error("Create agendaUser error:", error);
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
        console.error("Fetch error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        if (request.method === "DELETE") {
            const body = await request.json();
            const { userId, eventId } = body;

            try {
                // Find the AgendaUser entry based on userId and eventId
                const agendaUserEntry = await prisma.agendaUser.findFirst({
                    where: { userId, eventId },
                });

                if (!agendaUserEntry) {
                    return new NextResponse(
                        JSON.stringify({ message: 'AgendaUser entry not found' }),
                        { status: 404 }
                    );
                }

                // Delete the AgendaUser entry
                await prisma.agendaUser.delete({
                    where: { id: agendaUserEntry.id },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully deleted the AgendaUser entry",
                        deletedAgendaUserId: agendaUserEntry.id,
                        eventId: agendaUserEntry.eventId,
                        userId: agendaUserEntry.userId,
                    }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Delete agendaUser error:", error);
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
        console.error("Fetch error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

