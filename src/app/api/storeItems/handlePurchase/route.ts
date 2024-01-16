import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function PUT(request: Request): Promise<NextResponse> {
    const body = await request.json();
    const { id, points } = body;

    try {
        const updatedUser = await prisma.users.update({
            where: { id },
            data: { points },
        });

        return NextResponse.json(JSON.stringify(updatedUser), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json(JSON.stringify({ message: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
