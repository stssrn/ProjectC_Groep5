// Page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { quizData } from './data';
import Container from '../components/Container';
import styles from "./page.module.css";
import { Popup } from "./score";


interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

const Page: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<Array<string | null>>(
        Array(quizData.length).fill(null)
    );
    const [progress, setProgress] = useState(0);

    const [isPopupVisible, setPopupVisible] = useState(false);
    const togglePopup = (score: number) => {
        // If the popup is already open for the selected reward, close it
        setScore(score);
    };

    const handleAnswerClick = (selectedAnswer: string) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[currentQuestion] = selectedAnswer;

        if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        setSelectedAnswers(newSelectedAnswers);
    };

    const handlePreviousClick = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleNextClick = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            const newProgress = ((currentQuestion + 1) / quizData.length) * 100;
            setProgress(newProgress);
        } else {
            setShowScore(true);
        }
    };

    useEffect(() => {
        // Open the popup when showScore becomes true
        if (showScore) {
            setPopupVisible(true);
        }
    }, [showScore]);

    const finishQuiz = () => {
        setPopupVisible(true);

        // Redirect to a different page
        // (You can handle the redirection logic here)
    };

    return (
        <Container title='Quiz'>
            {isPopupVisible && (
                <Popup
                    isPopupVisible={isPopupVisible}
                    togglePopup={() => setPopupVisible(false)}
                    score={score}
                />
            )}
            <div className={styles.quizContainer}>
                <div className={styles.quizContent}>
                    <div>
                        {showScore ? (
                            <div>
                                <h2>Score: {score}</h2>
                                <h3>Antwoorden:</h3>
                                <ul>
                                    {quizData.map((question, index) => (
                                        <li key={index}>
                                            <strong>{question.question}</strong>:
                                            <p>
                                                {selectedAnswers[index] === question.correctAnswer
                                                    ? 'Correct'
                                                    : selectedAnswers[index]
                                                        ? `Incorrect (Jou antwoord: ${selectedAnswers[index]}, Correcte antwoord: ${question.correctAnswer})`
                                                        : `Niet beantwoord (Correcte antwoord: ${question.correctAnswer})`}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                                <div className={styles.buttonContainer}>
                                    {/* Conditionally render the Finish button based on whether the popup is visible or not */}
                                    {!isPopupVisible && <button onClick={finishQuiz}>Finish</button>}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2>{quizData[currentQuestion].question}</h2>
                                <ul className={styles.answerList}>
                                    {quizData[currentQuestion].options.map((option, index) => (
                                        <li key={index}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="answer"
                                                    value={option}
                                                    checked={selectedAnswers[currentQuestion] === option || false}
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

                {(!showScore && !isPopupVisible) && (
                    <div className={styles.buttonContainer}>
                        {currentQuestion > 0 && (
                            <button onClick={handlePreviousClick}>Vorige</button>
                        )}
                        <button onClick={handleNextClick}>
                            {currentQuestion < quizData.length - 1 ? 'Volgende' : 'Inleveren'}
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