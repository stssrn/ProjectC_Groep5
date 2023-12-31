import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { DateTime } from 'luxon';


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


            if (!id || id === "0") {
                const bugs = await prisma.bug.findMany();
                const formattedBugs = bugs.map(bug => ({
                    ...bug,
                    date: DateTime.fromJSDate(bug.date, { zone: 'utc' }).toLocal().toJSDate(),
                }));

                return NextResponse.json({ formattedBugs }, { status: 200 });
            }
            //console.log("before id=0 return formatted events:");
            //for (const event of formattedEvents) {
            //    console.log(event.date);
            //}
            const bug = await prisma.bug.findFirst({
                where: {
                    id: Number(id),
                },
            });

            if (!bug) {
                return new NextResponse(
                    JSON.stringify({ message: 'No bug reports found', event: null }),
                    { status: 404 }
                );
            }
            const formattedBug = {
                ...bug,
                date: DateTime.fromJSDate(bug.date, { zone: 'utc' }).toLocal().toJSDate(),
            };
            // console.log("before the return single formatted event");
            // console.log(formattedEvent.date);
            return NextResponse.json({ formattedBug }, { status: 200 });
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

export async function POST(request: Request): Promise<NextResponse> {
    try {
        if (request.method === "POST") {
            const body = await request.json();
            const { title, description, date } = body;

            try {
                // Create a new AgendaUser entry
                const newBugReport = await prisma.bug.create({
                    data: { title, description, date },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully created a new bug report",
                        title: newBugReport.title,
                        description: newBugReport.description,
                        date: newBugReport.date,
                    }),
                    { status: 201 } // 201 Created status code for successful creation
                );
            } catch (error) {
                console.error("Create bug report error:", error);
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


