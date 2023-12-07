"use client";
import { useState } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";

const Page: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);

    const quizData = [
        {
            question: 'Wat is een veelvoorkomend symptoom van stress?',
            options: [
                'Verhoogde energie',
                'Vermoeidheid',
                'Verbeterde concentratie',
                'Betere slaapkwaliteit',
            ],
            correctAnswer: 'Vermoeidheid',
        },
        {
            question: 'Welke activiteit kan helpen bij het verminderen van angst?',
            options: ['Rennen', 'Meditatie', 'Koffie drinken', 'TV kijken'],
            correctAnswer: 'Meditatie',
        },
        {
            question: 'Wat is een mogelijke oorzaak van depressie?',
            options: [
                'Overmatige lichaamsbeweging',
                'Tekort aan sociale interactie',
                'Te veel slaap',
                'Chemische onbalans in de hersenen',
            ],
            correctAnswer: 'Chemische onbalans in de hersenen',
        },
        // Add more questions as needed
    ];

    const handleAnswer = (selectedAnswer: string) => {
        const currentQuestionData = quizData[currentQuestion];

        // Check if the selected answer is correct
        if (selectedAnswer === currentQuestionData.correctAnswer) {
            setScore(score + 1);
        }

        // Move to the next question
        const nextQuestion = currentQuestion + 1;

        // Check if it's the last question, otherwise move to the next question
        if (nextQuestion < quizData.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            // Quiz is finished
            alert(`Quiz is afgelopen! Je score is ${score} van de ${quizData.length} vragen.`);
            // You can add additional actions here, like resetting the quiz or displaying results.
        }
    };
    return (
        <Container title="Quiz">
            <div>
                <h1>Mental Health Quiz</h1>
                <p>Vraag {currentQuestion + 1}: {quizData[currentQuestion].question}</p>
                <ul>
                    {quizData[currentQuestion].options.map((option, index) => (
                        <li key={index} onClick={() => handleAnswer(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
                <p>Score: {score}</p>
            </div>
        </Container>
    );
};

export default Page;
