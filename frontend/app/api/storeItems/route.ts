import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const searchParams = new URL(request.url).searchParams;
        const userId = searchParams.get("userId");

        if (userId) {
            // Return only unredeemed items for the specific user
            const unredeemedItems = await prisma.storeItems.findMany({
                where: {
                    NOT: {
                        storeItemsUser: {
                            some: {
                                userId: Number(userId),
                            },
                        },
                    },
                },
                orderBy: {
                    id: 'asc', // or 'desc' for descending order
                },
            });

            return NextResponse.json(unredeemedItems, { status: 200 });
        } else {
            // No user ID provided, return all items
            const allStoreItems = await prisma.storeItems.findMany({
                orderBy: {
                    id: 'asc', // or 'desc' for descending order
                },
            });

            return NextResponse.json(allStoreItems, { status: 200 });
        }
    } catch (error) {
        console.error("Fetch store items error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
