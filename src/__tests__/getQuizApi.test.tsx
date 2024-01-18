import { getQuiz } from "../test_thingy/getQuiz";

test("Fetching an non-existant quiz", async () => {
    await expect(getQuiz(-1)).rejects.toBe("Quiz not found");
});

test("Fetching a storeItem with wrong id type", async () => {
    await expect(getQuiz("hi")).rejects.toBe("Invalid quiz id");
});

test("Fetching a quiz with correct structure", async () => {
    const quiz = await getQuiz(1);

    expect(quiz).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        points: expect.any(Number),
        questions: expect.arrayContaining([
            {
                question: expect.any(String),
                options: expect.arrayContaining([expect.any(String)]),
                correctAnswer: expect.any(String),
            },
        ]),
    });
});