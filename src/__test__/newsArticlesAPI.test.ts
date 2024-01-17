import { POST } from "../app/api/newsArticles/route";
import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from "next";

describe('/app/api/newsArticles', () => {
    test('Creates a new news article'), async () => {
        const { req, res } = createMocks({
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: 'Test',
                content: 'Test',
                url: 'Test.com'
            }),
        });
    }
})