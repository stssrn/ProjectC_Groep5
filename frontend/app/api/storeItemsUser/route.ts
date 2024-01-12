import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request: Request): Promise<NextResponse> {
    try {
        if (request.method === 'GET') {
            const searchParams = new URL(request.url).searchParams;
            const userId = searchParams.get("userId");
            const storeItemId = searchParams.get("storeItemId");
            const id = searchParams.get("id");

            if (userId || storeItemId || id) {
                // At least one of userId, quizId, or id is provided

                if (userId) {
                    const storeItemsUserData = await prisma.storeItemsUser.findMany({
                        where: {
                            userId: Number(userId),
                        },
                    });

                    if (storeItemsUserData.length === 0) {
                        return new NextResponse(
                            JSON.stringify({ message: 'No entries found for the given userId', storeItemsUserData: [] }),
                            { status: 404 }
                        );
                    }

                    return NextResponse.json({ storeItemsUserData: storeItemsUserData }, { status: 200 });
                } else if (storeItemId) {
                    // Handle quizId similarly as userId (you can customize this part)
                    const storeItemsUserData = await prisma.storeItemsUser.findMany({
                        where: {
                            storeItemId: Number(storeItemId),
                        },
                    });

                    if (storeItemsUserData.length === 0) {
                        return new NextResponse(
                            JSON.stringify({ message: 'No entries found for the given quizId', storeItemsUserData: [] }),
                            { status: 404 }
                        );
                    }

                    return NextResponse.json({ storeItemsUserData: storeItemsUserData }, { status: 200 });
                } else if (id) {
                    // Handle id similarly as userId (you can customize this part)
                    const storeItemsUserEntry = await prisma.storeItemsUser.findFirst({
                        where: {
                            id: Number(id),
                        },
                    });

                    if (!storeItemsUserEntry) {
                        return new NextResponse(
                            JSON.stringify({ message: 'No entry found for the given id', entry: null }),
                            { status: 404 }
                        );
                    }

                    return NextResponse.json({ entry: storeItemsUserEntry }, { status: 200 });
                }
            } else {
                // None of userId, quizId, or id is provided, return all items
                const allStoreItemsUserData = await prisma.storeItemsUser.findMany();

                return NextResponse.json({ quizUserData: allStoreItemsUserData }, { status: 200 });
            }
        } else {
            return new NextResponse(
                JSON.stringify({ message: 'Method error' }),
                { status: 405 }
            );
        }
        return new NextResponse(
            JSON.stringify({ message: 'Invalid request' }),
            { status: 400 }
        );
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
            const { storeItemId, userId } = body;

            // Check if an entry already exists for the given user and quiz
            const existingStoreItemsUser = await prisma.storeItemsUser.findFirst({
                where: {
                    userId: Number(userId),
                    storeItemId: Number(storeItemId),
                },
            });

            if (existingStoreItemsUser) {
                // Entry already exists, you may want to update it or return an error
                return new NextResponse(
                    JSON.stringify({
                        message: 'StoreItemsUser entry already exists',
                        quizUserId: existingStoreItemsUser.id
                    }),
                    { status: 409 } // 409 Conflict status code for resource conflict
                );
            }

            // Create a new QuizUser entry
            const newStoreItemsUser = await prisma.storeItemsUser.create({
                data: { storeItemId, userId },
            });

            return new NextResponse(
                JSON.stringify({
                    quizUserId: newStoreItemsUser.id,
                    storeItemId: newStoreItemsUser.storeItemId,
                    userId: newStoreItemsUser.userId,

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
        console.error("Create storeItemUser error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        if (request.method === "DELETE") {
            const body = await request.json();
            const { userId, storeItemId } = body;

            try {
                // Find the AgendaUser entry based on userId and eventId
                const storeItemsUserEntry = await prisma.storeItemsUser.findFirst({
                    where: { userId, storeItemId },
                });

                if (!storeItemsUserEntry) {
                    return new NextResponse(
                        JSON.stringify({ message: 'storeItemUser entry not found' }),
                        { status: 404 }
                    );
                }

                // Delete the AgendaUser entry
                await prisma.storeItemsUser.delete({
                    where: { id: storeItemsUserEntry.id },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully deleted the storeItemsUser entry",
                        deletedQuizUserId: storeItemsUserEntry.id,
                        storeItemId: storeItemsUserEntry.storeItemId,
                        userId: storeItemsUserEntry.userId,
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