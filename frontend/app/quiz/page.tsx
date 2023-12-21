'use client'
import { useEffect, useState } from 'react';
import Container from '../components/Container';
import styles from './page.module.css';
import { Popup } from './score';

interface QuizData {
    quizId: number;
    quizTitle: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: string;
    }[];
}

const Page: React.FC = () => {
    const [quizzes, setQuizzes] = useState<QuizData[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [isPopupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('/api/quiz');
                const data = await response.json();
                setQuizzes(data.quizzes);
            } catch (error) {
                console.error('Fetch quizzes error:', error);
            }
        };

        fetchQuizzes();
    }, []);

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
        if (selectedAnswer === quizzes[currentQuestion].questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        setSelectedAnswer(null);

        if (currentQuestion < quizzes.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            const newProgress = ((currentQuestion + 1) / quizzes.length) * 100;
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
                                    {quizzes.map((quiz, index) => (
                                        <li key={index}>
                                            <strong>{quiz.questions[index].question}</strong>:
                                            <p>
                                                {selectedAnswer === quiz.questions[index].correctAnswer
                                                    ? 'Correct'
                                                    : selectedAnswer
                                                        ? `Incorrect (Your answer: ${selectedAnswer}, Correct answer: ${quiz.questions[index].correctAnswer})`
                                                        : `Not answered (Correct answer: ${quiz.questions[index].correctAnswer})`}
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
                                <h2>{quizzes[currentQuestion].questions[currentQuestion].question}</h2>
                                <ul>
                                    {quizzes[currentQuestion].questions[currentQuestion].options.map((option, qIndex) => (
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
                            {currentQuestion < quizzes.length - 1 ? 'Next' : 'Submit'}
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
