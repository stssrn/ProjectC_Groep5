import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request): Promise<NextResponse> {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("Id");

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ message: "Invalid storeItems ID" }, { status: 400 });
    }

    try {
        // Find the first quiz that the user hasn't finished or hasn't started yet
        const quiz = await prisma.storeItems.findUnique({
            where: { id: Number(id) }
        });

        return NextResponse.json({ quiz }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
