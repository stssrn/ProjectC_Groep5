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
                const newsArticles = await prisma.newsArticles.findMany();

                return NextResponse.json({ newsArticles }, { status: 200 });
            }

            const newsArticle = await prisma.newsArticles.findFirst({
                where: {
                    id: Number(id),
                },
            });
            if (!newsArticle) {
                return new NextResponse(
                    JSON.stringify({ message: 'No articles found', article: null })

                );
            }

            return NextResponse.json({ article: newsArticle }, { status: 200 });
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
            const { title, content, url } = body;
            try {
                const newArticle = await prisma.newsArticles.create({
                    data: { title, content, url },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully created a new newsArticle entry",
                        newsArticleId: newArticle.id,
                        title: newArticle.title,
                        content: newArticle.content,
                        url: newArticle.url
                    }),
                    { status: 201 }
                );
            } catch (error) {
                console.error("Create newsArtice error:", error);
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
            const { id, title, content, url } = body;
            try {
                const updatedNewsArticle = await prisma.newsArticles.update({
                    where: { id },
                    data: { title, content, url },
                });
                return new NextResponse(
                    JSON.stringify({ message: "Succesfully changed the data", id: updatedNewsArticle.id }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Update newsArticles error:", error);
                return new NextResponse(JSON.stringify({ message: "Server error" }), {
                    status: 500,
                });
            }
        }

    }
    catch (error) {
        console.error("Update newsArticles error:", error);
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
            if (!searchParams) {
                return new NextResponse(
                    JSON.stringify({ message: 'Missing ID in the request body' }),
                    { status: 400 }
                );
            }

            try {
                const newsArticle = await prisma.newsArticles.findFirst({
                    where: { id },
                });

                if (!newsArticle) {
                    return new NextResponse(
                        JSON.stringify({ message: 'News Article not found' }),
                        { status: 404 }
                    );
                }

                await prisma.newsArticles.delete({
                    where: { id: newsArticle.id },
                });

                return new NextResponse(
                    JSON.stringify({
                        message: "Successfully deleted the News Article",
                        deletedNewsArticleId: newsArticle.id,
                        title: newsArticle.title,
                        content: newsArticle.content,
                        url: newsArticle.url,
                    }),
                    { status: 200 }
                );
            } catch (error) {
                console.error("Delete newsArticle error:", error);
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