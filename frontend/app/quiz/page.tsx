'use client'
import { useEffect, useState } from 'react';
import Container from '../components/Container';
import styles from './page.module.css';
import { useSession } from 'next-auth/react';
import prisma from "../../lib/prisma";

interface Quiz {
    id: number;
    title: string;
    points: number;
    questions: {
        question: string;
        options: string[];
        correctAnswer: string;
    }[];
}

interface UserAnswers {
    answers: {
        id: number;
        answer: string;
        isCorrect: boolean;
    }[];
}

type UserData = {
    id: number;
    email: string;
    password: string;
    bio: string;
    points: number;
    profilePhoto: "MALE" | "FEMALE";
    profilePhotoUrl?: string;
    firstName: string;
    lastName: string;
    username: string;
    registrationDate: string;
};

const Page: React.FC = () => {
    const { data: session } = useSession();
    // const [userId, setUserId] = useState<number | null>();
    const [user, setUserData] = useState<UserData | null>();
    const [quiz, setQuiz] = useState<Quiz>();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<UserAnswers | null>(null);
    const [progress, setProgress] = useState(0);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        fetchQuiz(1);

        if (session?.user?.id) {
            fetchUser(session?.user?.id);
        }
    }, [session]);

    const fetchQuiz = async (Id: number) => {
        try {
            const response = await fetch(`/api/quizzes/fetchById?id=${Id}`);
            if (!response.ok) throw new Error("Failed to fetch quiz");

            const data: { quiz: Quiz } = await response.json();
            setQuiz(data.quiz); // Assuming the API returns the entire quiz data
        } catch (error) {
            console.error('Fetch quiz error:', error);
            // Handle error, e.g., show an error message to the user
        }
    };

    const fetchUser = async (userId: number) => {
        try {
            const response = await fetch(`/api/quizzes/fetchUser?id=${userId}`);
            if (!response.ok) throw new Error("Failed to fetch user data");

            const data: { user: UserData } = await response.json();
            setUserData(data.user);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const rewardPoints = async () => {
        try {
            const response = await fetch('/api/quizzes/rewardPoints', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user?.id,
                    earnedPoints: points,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update points');
            }

            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    const saveToQuizUsers = async () => {
        try {
            const response = await fetch("api/quizUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quizId: quiz?.id,
                    userId: Number(session?.user?.id),
                    isCompleted: true,
                    pointsScored: points,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add bug and/or user data");
            }
        } catch (error) {
            console.error("Error updating bug and/or user data:", error);
        }
    };

    const handleAnswerClick = (userAnswer: string) => {
        const currentAnswers = selectedAnswer ? [...selectedAnswer.answers] : [];

        const answerExists = currentAnswers.some(answer => answer.id === currentQuestion);

        if (!answerExists) {
            const newAnswer = {
                id: currentQuestion,
                answer: userAnswer,
                isCorrect: userAnswer === quiz?.questions[currentQuestion].correctAnswer
            };

            setSelectedAnswer({
                answers: [...currentAnswers, newAnswer],
            });
        } else {
            const updatedAnswers = [...currentAnswers];

            updatedAnswers[currentQuestion] = {
                id: currentQuestion,
                answer: userAnswer,
                isCorrect: userAnswer === quiz?.questions[currentQuestion].correctAnswer
            };

            setSelectedAnswer({ answers: updatedAnswers });
        }
    };

    const handlePreviousClick = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleNextClick = () => {
        if (currentQuestion + 1 < (quiz?.questions.length ?? 0)) {
            setCurrentQuestion(currentQuestion + 1);
            const newProgress = ((currentQuestion + 1) / (quiz?.questions.length ?? 0)) * 100;
            setProgress(newProgress);
        } else {
            const pointsEarned = selectedAnswer?.answers?.reduce((count, answer) => count + (answer.isCorrect ? 1 : 0), 0);
            setPoints(pointsEarned ?? 0);
            setShowScore(true);
        }
    };

    const finishQuiz = () => {
        rewardPoints();
        saveToQuizUsers();
        // window.location.href = '/dashboard';
    };

    return (
        <Container title="Quiz">
            <div className={styles.quizContainer}>
                <div className={styles.quizContent}>
                    <div>
                        {showScore ? (
                            <div>
                                <h2>Score: {selectedAnswer?.answers?.reduce((count, answer) => count + (answer.isCorrect ? 1 : 0), 0)}/{quiz?.questions.length}</h2>
                                <ul>
                                    {quiz?.questions.map((quiz, index) => (
                                        <li key={index}>
                                            <strong>{quiz.question}</strong>:
                                            <p>
                                                {selectedAnswer?.answers[index]?.answer === quiz.correctAnswer
                                                    ? `Correct (jouw antwoord: ${selectedAnswer?.answers[index]?.answer})`
                                                    : selectedAnswer
                                                        ? `Incorrect (jouw antwoord: ${selectedAnswer?.answers[index]?.answer ?? "-"}, juiste answer: ${quiz.correctAnswer})`
                                                        : `Niet beantwoord (jouw antwoord: ${quiz.correctAnswer})`}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                                <div className={styles.buttonContainer}>
                                    <button onClick={finishQuiz}>Terug naar home</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2>{quiz?.questions[currentQuestion].question}</h2>
                                <ul className={styles.answerList}>
                                    {quiz?.questions[currentQuestion].options.map((option, index) => (
                                        <li key={index}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="answer"
                                                    value={option}
                                                    checked={selectedAnswer?.answers[currentQuestion]?.answer === option}
                                                    onChange={() => handleAnswerClick(option)}
                                                />
                                                {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {!showScore && (
                    <div className={styles.buttonContainer}>
                        {currentQuestion > 0 && <button onClick={handlePreviousClick}>Vorige</button>}
                        <button onClick={handleNextClick}>
                            {currentQuestion + 1 < (quiz?.questions.length ?? 0) ? 'Volgende' : 'Afronden'}
                        </button>
                    </div>
                )}
                {!showScore && (
                    <div className={styles.progressBar}>
                        <progress className={styles.progress} value={progress} max="100" />
                        <span style={{ marginLeft: '10px' }}>{progress.toFixed()}%</span>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Page;
