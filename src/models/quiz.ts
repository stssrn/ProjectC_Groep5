export interface Quiz {
    id: number;
    title: string;
    points: number;
    questions: {
        question: string;
        options: string[];
        correctAnswer: string;
    }[];
}