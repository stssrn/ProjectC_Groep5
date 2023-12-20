import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request: Request): Promise<NextResponse> {
    try {
        if (request.method !== 'GET') {
            return new NextResponse(
                JSON.stringify({ message: 'Method error' }),
                { status: 405 }
            );
        } else {
            try {
                const events = await prisma.event.findMany();
                if (!events) {
                    return new NextResponse(
                        JSON.stringify({ message: 'No events found', events: [] }),
                        { status: 404 }
                    );
                }
                return NextResponse.json({ events: events }, { status: 200 });
            } catch (error) {
                console.error("Fetch event error:", error);
                return new NextResponse(JSON.stringify({ message: "Server error" }), {
                    status: 500,
                });
            }
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}
