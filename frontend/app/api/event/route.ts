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
            const event = await prisma.event.findFirst({
                where: {
                    id: Number(id),
                },
            });
            if (Number(id) === 0) {
                const events = await prisma.event.findMany();
                const formattedEvents = events.map(event => ({
                    ...event,
                    date: DateTime.fromJSDate(event.date, { zone: 'utc' }).toLocal().toJSDate(),
                }));

                //console.log("before id=0 return formatted events:");
                //for (const event of formattedEvents) {
                //    console.log(event.date);
                //}
                return NextResponse.json({ formattedEvents }, { status: 200 });
            }
            if (!event) {
                return new NextResponse(
                    JSON.stringify({ message: 'No events found', event: null }),
                    { status: 404 }
                );
            }
            const formattedEvent = {
                ...event,
                date: DateTime.fromJSDate(event.date, { zone: 'utc' }).toLocal().toJSDate(),
            };
            // console.log("before the return single formatted event");
            // console.log(formattedEvent.date);
            return NextResponse.json({ formattedEvent }, { status: 200 });
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
            const { date, name, description } = body;

            try {
                // Create a new AgendaUser entry
                const newEvent = await prisma.event.create({
                    data: { date, name, description },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully created a new event entry",
                        eventId: newEvent.id,
                        eventDate: newEvent.date,
                        eventName: newEvent.name,
                        eventDesc: newEvent.description
                    }),
                    { status: 201 } // 201 Created status code for successful creation
                );
            } catch (error) {
                console.error("Create event error:", error);
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
                const eventEntry = await prisma.event.findFirst({
                    where: { id },
                });

                if (!eventEntry) {
                    return new NextResponse(
                        JSON.stringify({ message: 'Event entry not found' }),
                        { status: 404 }
                    );
                }

                await prisma.event.delete({
                    where: { id: eventEntry.id },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully deleted the Event entry",
                        deletedEventId: eventEntry.id,
                        eventDate: eventEntry.date,
                        eventName: eventEntry.name,
                        eventDesc: eventEntry.description,
                    }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Delete Event error:", error);
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

export async function PUT(request: Request): Promise<NextResponse> {
    try {
        if (request.method !== "PUT") {
            return new NextResponse(JSON.stringify({ message: "Method error" }), {
                status: 405,
            });
        }
        else {
            const body = await request.json();
            const { id, date, name, description } = body;
            try {
                const updatedEvent = await prisma.event.update({
                    where: { id },
                    data: { date: date, name: name, description: description },
                });
                return new NextResponse(
                    JSON.stringify({ message: "Succesfully changed the data", eventId: updatedEvent.id }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Update Event error:", error);
                return new NextResponse(JSON.stringify({ message: "Server error" }), {
                    status: 500,
                });
            }
        }

    }
    catch (error) {
        console.error("Update error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

