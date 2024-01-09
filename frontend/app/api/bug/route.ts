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

            if (Number(id) === 0) {
                const bugReports = await prisma.bug.findMany();
                const formattedBugs = bugReports.map(report => ({
                    ...report,
                    date: DateTime.fromJSDate(report.date, { zone: 'utc' }).toLocal().toJSDate(),
                }));

                return NextResponse.json({ formattedBugs: formattedBugs }, { status: 200 });
            }

            const bugReport = await prisma.bug.findFirst({
                where: {
                    id: Number(id),
                },
            });

            if (!bugReport) {
                return new NextResponse(
                    JSON.stringify({ message: 'No bug reports found', report: null }),
                    { status: 404 }
                );
            }
            const formattedBug = {
                ...bugReport,
                date: DateTime.fromJSDate(bugReport.date, { zone: 'utc' }).toLocal().toJSDate(),
            };
            // console.log("before the return single formatted event");
            // console.log(formattedEvent.date);
            return NextResponse.json({ formattedBug: formattedBug }, { status: 200 });
        } else {
            return new NextResponse(
                JSON.stringify({ message: 'Method error' }),
                { status: 405 }
            );
        }
    } catch (error: any) {
        console.error("Fetch bug report error:", error);
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


export async function PUT(request: Request): Promise<NextResponse> {
    try {
        if (request.method !== "PUT") {
            return new NextResponse(JSON.stringify({ message: "Method error" }), {
                status: 405,
            });
        }
        else {
            const body = await request.json();
            const { id, title, description } = body;
            try {
                const updatedBugReport = await prisma.bug.update({
                    where: { id },
                    data: { title, description },
                });
                return new NextResponse(
                    JSON.stringify({ message: "Succesfully changed the data", bugId: updatedBugReport.id }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Update bug report error:", error);
                return new NextResponse(JSON.stringify({ message: "Server error" }), {
                    status: 500,
                });
            }
        }

    }
    catch (error) {
        console.error("Update bug report error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        if (request.method === "DELETE") {
            const searchParams = new URL(request.url).searchParams;
            const id = Number(searchParams.get("id"));
            console.log
            if (!searchParams) {
                return new NextResponse(
                    JSON.stringify({ message: 'Missing ID in the request body' }),
                    { status: 400 }
                );
            }

            try {
                const bugEntry = await prisma.bug.findFirst({
                    where: { id },
                });

                if (!bugEntry) {
                    return new NextResponse(
                        JSON.stringify({ message: 'Bug entry not found' }),
                        { status: 404 }
                    );
                }

                await prisma.bug.delete({
                    where: { id: bugEntry.id },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully deleted the Bug entry",
                        deletedBugUserId: bugEntry.id,
                        title: bugEntry.title,
                        description: bugEntry.description,
                    }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Delete bug error:", error);
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
