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
            if (Number(id) === 0) {
                const educatieModuleData = await prisma.educatie_modules.findMany();

                return NextResponse.json({ educatieModules: educatieModuleData }, { status: 200 });
            }

            const educatieModule = await prisma.educatie_modules.findFirst({
                where: {
                    id: Number(id),
                },
            });
            if (!educatieModule) {
                return new NextResponse(
                    JSON.stringify({ message: 'No entries found', entry: null })

                );
            }

            return NextResponse.json({ entry: educatieModule }, { status: 200 });
        } else {
            return new NextResponse(
                JSON.stringify({ message: 'Method error' }),
                { status: 405 }
            );
        }
    } catch (error: any) {
        console.error("Get error:", error);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        if (request.method === "POST") {
            const body = await request.json();
            const { id, title, description } = body;
            console.log(id);
            try {
                const newEducatieModule = await prisma.educatie_modules.create({
                    data: { id, title, description },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully created a new educatie_modules entry",
                        educatieModulesId: newEducatieModule.id,
                        title: newEducatieModule.title,
                        description: newEducatieModule.description,
                    }),
                    { status: 201 } // 201 Created status code for successful creation
                );
            } catch (error) {
                console.error("Create educatie_modules error:", error);
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
                const updatedEducatieModule = await prisma.educatie_modules.update({
                    where: { id },
                    data: { title, description },
                });
                return new NextResponse(
                    JSON.stringify({ message: "Succesfully changed the data", id: updatedEducatieModule.id }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Update educatie_modules error:", error);
                return new NextResponse(JSON.stringify({ message: "Server error" }), {
                    status: 500,
                });
            }
        }

    }
    catch (error) {
        console.error("Update educatie_module error:", error);
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
                const educatieModule = await prisma.educatie_modules.findFirst({
                    where: { id },
                });

                if (!educatieModule) {
                    return new NextResponse(
                        JSON.stringify({ message: 'Educatie module not found' }),
                        { status: 404 }
                    );
                }

                await prisma.bug.delete({
                    where: { id: educatieModule.id },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully deleted the educatie module",
                        deletedEducatieModuleId: educatieModule.id,
                        title: educatieModule.title,
                        description: educatieModule.description,
                    }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Delete educatie module error:", error);
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