import { Post } from "@/models/post";

export async function getQuiz(id: string | number): Promise<Post> {
    const res = await fetch(`/api/quizzes/fetchById?id=${id}`);
    if (res.status === 404) throw "Quiz not found";
    if (res.status === 400) throw "Invalid quiz id";
    const quiz = await res.json();
    return quiz.quiz;
}