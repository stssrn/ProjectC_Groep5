import styles from "./QuizSection.module.css";
import Container from "../components/Container";
import clsx from "clsx";

interface CurrentQuiz {
    topic: string;
    questions: number;
    questionsAnswered: number;
}

const currentQuiz: CurrentQuiz = {
    topic:
        "Onderwerp: casussen",
    questions: 10,
    questionsAnswered: 5,
};

const QuizBlock: React.FC<{
    className?: string;
}> = ({ className }) => {
    return (
        <section className={className}>
            <Container padding={12} title="Quiz nummer: #">
                <div className={styles.quizes}>
                    <article className={styles.quiz}>
                        <div className={styles.top}>
                            <div className={styles.topOverlay}></div>
                            <p className={styles.quizTopic}>{currentQuiz.topic}</p>
                        </div>
                        <div className={styles.quizProgressTracker}>
                            <h2>{(currentQuiz.questionsAnswered / currentQuiz.questions) * 100}%</h2>

                            <div className={styles.quizProgressBar}>
                                <div className={styles.quizProgress}></div>
                            </div>
                        </div>
                    </article>
                </div>
            </Container>
        </section>
    );
};
export default QuizBlock;
