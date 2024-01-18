'use client'
import React, { useEffect, useState } from 'react';
import styles from "./QuizSection.module.css";
import Container from "../components/Container";
import clsx from "clsx";
import { useSession } from 'next-auth/react';

const QuizBlock: React.FC<{
    className?: string;
}> = ({ className }) => {
    const [quizzesDone, setQuizzesDone] = useState(0);
    const [quizzes, setQuizzes] = useState(0);
    const { data: session } = useSession();
    const [lineBreaks, setLineBreaks] = useState(false);


    useEffect(() => {
        // Fetch data from your API endpoint
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`/api/quizzes`);
                const data = await response.json();
                setQuizzes(data.length); // Adjust this based on your API response structure
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        }
        const fetchData = async () => {
            try {
                if (session?.user.id) {
                    const response = await fetch(`/api/quizUser?userId=${session.user.id}`);
                    const data = await response.json();
                    setQuizzesDone(data.quizUserData.length);
                    if (response.status === 404) {
                        setQuizzesDone(0);
                    }
                }
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        };
        if (window.innerWidth < 1200) setLineBreaks(false);
        else setLineBreaks(true);

        fetchQuizzes();
        fetchData();
    }, []);

    if (!quizzesDone && quizzesDone !== 0) {
        return <p>Laden..</p>;
    }

    const progress = (quizzesDone / quizzes) * 100;

    return (
        <section className={className}>
            <Container padding={12} title={quizzesDone === quizzes ? `Alle quizzen gedaan` : `Volgende quiz: ${quizzesDone + 1}`}>

                <div className={styles.quizes}>
                    <article className={styles.quiz}>
                        <div className={styles.quizProgressTracker}>
                            <h3>Afgeronde quizzen: {quizzesDone}/{quizzes}</h3>
                            {lineBreaks && (
                                <br></br>
                            )}
                            <div className={styles.quizProgressBar}>
                                <div
                                    className={styles.quizProgress}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </article>
                </div>
            </Container>
        </section>
    );
};

export default QuizBlock;
