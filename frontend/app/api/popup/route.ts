import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function PUT(request: Request): Promise<NextResponse> {
    try {
        if (request.method !== "PUT") {
            return new NextResponse(JSON.stringify({ message: "Method error" }), {
                status: 405,
            });
        }
        else {
            const body = await request.json();
            const { id, firstLogin } = body;
            console.log(id, firstLogin)
            try {
                const updatedUser = await prisma.users.update({
                    where: { id },
                    data: { firstLogin },
                });
                //res.status(200).json(updatedUser);
                return new NextResponse(
                    JSON.stringify({ message: "Succesvol data aangepast", userId: updatedUser.id }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Update user error:", error);
                return new NextResponse(JSON.stringify({ message: "Server error" }), {
                    status: 500,
                });
            }
        }

    }
    catch (error) {
        console.error("Update user error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}