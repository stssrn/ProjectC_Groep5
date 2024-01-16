import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request): Promise<NextResponse> {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get("id");

    if (!userId || isNaN(Number(userId))) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { id: Number(userId) },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error("Fetch user error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
