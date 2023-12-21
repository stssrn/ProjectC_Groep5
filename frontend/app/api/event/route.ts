import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';


export async function GET(request: Request): Promise<NextResponse> {
    try {
        if (request.method === 'GET') {
            const searchParams = new URL(request.url).searchParams;
            const id = searchParams.get("id");
            if (!searchParams) {
                return new NextResponse(
                    JSON.stringify({ message: 'Missing ID in the request body' }),
                    { status: 400 }
                );
            }
            const event = await prisma.event.findFirst({
                where: {
                    id: Number(id),
                },
            });
            if (Number(id) === 0) {
                const events = await prisma.event.findMany();
                return NextResponse.json({ events: events }, { status: 200 });
            }
            if (!event) {
                return new NextResponse(
                    JSON.stringify({ message: 'No events found', event: null }),
                    { status: 404 }
                );
            }

            return NextResponse.json({ event }, { status: 200 });
        } else {
            return new NextResponse(
                JSON.stringify({ message: 'Method error' }),
                { status: 405 }
            );
        }
    } catch (error: any) {
        console.error("Fetch event error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}


