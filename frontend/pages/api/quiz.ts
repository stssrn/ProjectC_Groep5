// Import necessary modules and types
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';

// Define the API handler function
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Check if the request method is GET
    if (req.method === 'GET') {
        try {
            // Extract the quiz ID from the query parameters
            const quizId = parseInt(req.query.id as string, 10);

            // Fetch the quiz with the specified ID and include related QuizUser data
            const quiz = await prisma.quiz.findUnique({
                where: { id: quizId },
                include: {
                    QuizUser: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            // Check if the quiz exists
            if (quiz) {
                // Format the quiz data as needed
                const formattedQuiz = {
                    quizId: quiz.id,
                    quizTitle: quiz.title,
                    questions: quiz.questions as Prisma.JsonArray,
                    points: quiz.points,
                };

                // Respond with the formatted quiz data
                res.status(200).json({ quiz: formattedQuiz });
            } else {
                // If the quiz doesn't exist, respond with a 404 status
                res.status(404).json({ message: 'Quiz not found' });
            }
        } catch (error) {
            // Handle errors and respond with a 500 status
            console.error('Fetch quiz error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    } else {
        // If the request method is not GET, respond with a 405 status
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
