import { POST } from "../app/api/newsArticles/route";
import prisma from "../lib/prisma";

jest.mock('../lib/prisma', () => ({
    __esModule: true,
    default: {
        newsArticles: {
            create: jest.fn((data) => ({
                id: -99,
                title: data.title,
                content: data.content,
                url: data.url,
            })),
        },
    },
}));

test('POST request returns a successful response', async () => {
    const mockRequest = new Request('/api/newsArticles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: 'Test Article',
            content: 'Test content',
            url: 'https://example.com',
        }),
    });

    const response = await POST(mockRequest);

    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody).toEqual({
        message: 'Successfully created a new newsArticle entry',
        newsArticleId: 1,
        title: 'Test Article',
        content: 'Test content',
        url: 'https://example.com',
    });
});













