'use client'
import { useEffect, useState } from 'react';
import Container from '../components/Container';
import styles from './page.module.css';
import { Popup } from './score';

interface Quiz {
    Id: number;
    Title: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: string;

    }[];
    points: number;
}

const Page: React.FC = () => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [isPopupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        fetchQuiz("1");
    }, []);

    const fetchQuiz = async (Id: string) => {
        try {
            const response = await fetch(`/api/quiz?id=1`);
            if (!response.ok) throw new Error("Failed to fetch quiz");

            const data = await response.json();
            setQuiz(data); // Assuming the API returns the entire quiz data

        } catch (error) {
            console.error('Fetch quiz error:', error);
            // Handle error, e.g., show an error message to the user
        }
    };
    const togglePopup = (score: number) => {
        setScore(score);
    };

    const handleAnswerClick = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handlePreviousClick = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleNextClick = () => {
        if (selectedAnswer === quiz?.questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        setSelectedAnswer(null);

        if (currentQuestion < quiz?.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            const newProgress = ((currentQuestion + 1) / quiz?.questions.length) * 100;
            setProgress(newProgress);
        } else {
            setShowScore(true);
        }
    };

    const finishQuiz = () => {
        setPopupVisible(true);
    };

    return (
        <Container title="Quiz">

            {isPopupVisible && (
                <Popup isPopupVisible={isPopupVisible} togglePopup={() => setPopupVisible(false)} score={score} />
            )}
            <div className={styles.quizContainer}>
                <div className={styles.quizContent}>
                    <div>
                        {showScore ? (
                            <div>
                                <h2>Score: {score}</h2>
                                <h3>Answers:</h3>
                                <ul>
                                    {quiz?.questions.map((quiz, index) => (
                                        <li key={index}>
                                            <strong>{quiz.question}</strong>:
                                            <p>
                                                {selectedAnswer === quiz.correctAnswer
                                                    ? 'Correct'
                                                    : selectedAnswer
                                                        ? `Incorrect (Your answer: ${selectedAnswer}, Correct answer: ${quiz.correctAnswer})`
                                                        : `Not answered (Correct answer: ${quiz.correctAnswer})`}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                                <div className={styles.buttonContainer}>
                                    {!isPopupVisible && <button onClick={finishQuiz}>Finish</button>}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2>{quiz?.questions[currentQuestion].question}</h2>
                                <ul>
                                    {quiz?.questions[currentQuestion].options.map((option, qIndex) => (
                                        <li key={qIndex}>
                                            <button onClick={() => handleAnswerClick(option)}>{option}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {!showScore && !isPopupVisible && (
                    <div className={styles.buttonContainer}>
                        {currentQuestion > 0 && <button onClick={handlePreviousClick}>Previous</button>}
                        <button onClick={handleNextClick}>
                            {currentQuestion < quiz?.questions.length - 1 ? 'Next' : 'Submit'}
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
