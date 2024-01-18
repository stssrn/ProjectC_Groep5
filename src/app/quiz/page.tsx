'use client'

import { useEffect, useState } from 'react';
import Container from '../components/Container';
import styles from './page.module.css';
import { useSession } from 'next-auth/react';
import { Quiz } from '../../models/quiz';


interface UserAnswers {
    answers: {
        id: number;
        answer: string;
        isCorrect: boolean;
    }[];
}

interface UserData {
    id: number;
    email: string;
    password: string;
    bio: string;
    points: number;
    profilePhoto: 'MALE' | 'FEMALE';
    profilePhotoUrl?: string;
    firstName: string;
    lastName: string;
    username: string;
    registrationDate: string;
}

const Page: React.FC = () => {
    const { data: session } = useSession();
    const [user, setUserData] = useState<UserData | null>();
    const [quiz, setQuiz] = useState<Quiz>();
    const [quizUserId, setQuizUserId] = useState<number | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<UserAnswers | null>(null);
    const [progress, setProgress] = useState(0);
    const [points, setPoints] = useState(0);
    const [quizUserCreated, setQuizUserCreated] = useState(false);
    const [totalQuizzes, setTotalQuizzes] = useState<number | null>(null);
    const [userQuizzesCompleted, setUserQuizzesCompleted] = useState<number | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`/api/quizzes`);
                const data = await response.json();
                setTotalQuizzes(data.length);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        }
        const fetchData = async () => {
            try {
                if (session?.user.id) {
                    const response = await fetch(`/api/quizUser?userId=${session.user.id}`);
                    const data = await response.json();
                    setUserQuizzesCompleted(data.quizUserData.length);
                }
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        };
        const fetchQuizAndUser = async () => {
            try {
                if (session?.user?.id) {
                    // Check if quiz is already fetched
                    if (!user) {
                        const userResponse = await fetch(`/api/quizzes/fetchUser?id=${session?.user?.id}`);
                        if (!userResponse.ok) throw new Error('Failed to fetch user data');
                        const userData: { user: UserData } = await userResponse.json();
                        setUserData(userData.user);
                    }
                    if (!quiz) {
                        const quizResponse = await fetch(`/api/quizzes/fetchById?userId=${session?.user?.id}`);
                        if (quizResponse.status === 404) {
                            console.log("All quizzes completed");
                        }
                        if (!quizResponse.ok && quizResponse.status !== 404) throw new Error('Failed to fetch quiz');
                        const data: { quiz: Quiz } = await quizResponse.json();

                        setQuiz(data.quiz);
                    }
                }
            } catch (error) {
                console.error('Fetch data error:', error);
            }
        };

        fetchQuizzes();
        fetchData();
        fetchQuizAndUser();
    }, [session]);

    useEffect(() => {
        const initializeQuizUser = async () => {
            try {
                if (quiz && user && !quizUserCreated) {
                    setQuizUserCreated(true);
                    await createQuizUser();
                }
            } catch (error) {
                console.error('Initialize quiz user error:', error);
            }
        };

        initializeQuizUser();
    }, [quiz, user, quizUserCreated]);

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
            console.error('Reward points error:', error);
        }
    };

    const createQuizUser = async () => {
        try {
            if (!quiz || !user) return;

            const response = await fetch('api/quizUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quizId: quiz?.id,
                    userId: Number(session?.user?.id),
                    isCompleted: false,
                    pointsScored: 0,
                }),
            });

            if (response.ok) {
                const createdQuizUser = await response.json();
                console.log('Created quizUser entry:', createdQuizUser);

                if (createdQuizUser.quizUserId) {
                    setQuizUserId(createdQuizUser.quizUserId);
                } else {
                    console.error('quizUserId not found in the response.');
                }
            } else if (response.status === 409) {
                const existingQuizUser = await response.json();
                console.log('Existing quizUser entry:', existingQuizUser);

                if (existingQuizUser.quizUserId) {
                    setQuizUserId(existingQuizUser.quizUserId);
                } else {
                    console.error('quizUserId not found in the response.');
                }
            } else {
                throw new Error('Failed to add quizUser');
            }
        } catch (error) {
            console.error('Create quizUser error:', error);
        }
    };

    const updateQuizUser = async () => {
        try {
            const response = await fetch(`api/quizUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: quizUserId,
                    userId: Number(session?.user?.id),
                    quizId: quiz?.id,
                    isCompleted: quizCompleted,
                    earnedPoints: points,
                }),
            });

            if (response.ok) {
                const updatedQuizUser = await response.json();
                console.log('Updated quizUser entry:', updatedQuizUser);
            } else {
                throw new Error('Failed to update quizUser data');
            }
        } catch (error) {
            console.error('Update quizUser error:', error);
        }
    };

    const handleAnswerClick = (userAnswer: string) => {
        const currentAnswers = selectedAnswer ? [...selectedAnswer.answers] : [];

        const answerExists = currentAnswers.some((answer) => answer.id === currentQuestion);

        if (!answerExists) {
            const newAnswer = {
                id: currentQuestion,
                answer: userAnswer,
                isCorrect: userAnswer === quiz?.questions[currentQuestion].correctAnswer,
            };

            setSelectedAnswer({
                answers: [...currentAnswers, newAnswer],
            });
        } else {
            const updatedAnswers = [...currentAnswers];

            updatedAnswers[currentQuestion] = {
                id: currentQuestion,
                answer: userAnswer,
                isCorrect: userAnswer === quiz?.questions[currentQuestion].correctAnswer,
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
            const pointsEarned = selectedAnswer?.answers?.reduce((count, answer) => count + (answer.isCorrect ? 1 : 0), 0) ?? 0;
            setPoints(Math.floor((quiz?.points ?? 0) * (pointsEarned / (quiz?.questions.length ?? 1))));
            setQuizCompleted(true);
            setShowScore(true);
        }
    };

    const finishQuiz = async () => {
        try {
            await rewardPoints();
            await updateQuizUser();
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Error finishing quiz:', error);
        }
    };

    return (
        <Container title="Quiz">
            {quiz ? (
                <div className={styles.quizContainer}>
                    <div className={styles.quizContent}>
                        <div>
                            {showScore ? (
                                <div>
                                    <h2>
                                        Score: {selectedAnswer?.answers?.reduce((count, answer) => count + (answer.isCorrect ? 1 : 0), 0)}/{quiz?.questions.length}
                                    </h2>
                                    <h3>Punten verdiend: {points}</h3>
                                    <ul>
                                        {quiz?.questions.map((quiz, index) => (
                                            <li key={index}>
                                                <strong>{quiz.question}</strong>:
                                                <p>
                                                    {selectedAnswer?.answers[index]?.answer === quiz.correctAnswer
                                                        ? `Correct (jouw antwoord: ${selectedAnswer?.answers[index]?.answer})`
                                                        : selectedAnswer
                                                            ? `Incorrect (jouw antwoord: ${selectedAnswer?.answers[index]?.answer ?? '-'}, juiste answer: ${quiz.correctAnswer})`
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
            ) : (
                <div>
                    {totalQuizzes === null || userQuizzesCompleted === null ? (
                        <h3>Laden...</h3>
                    ) : totalQuizzes === userQuizzesCompleted ? (
                        <h3>Je hebt al de quizzen gedaan.</h3>
                    ) : (
                        <h3>Laden...</h3>
                    )}
                </div>
            )}
        </Container>
    );
};

export default Page;