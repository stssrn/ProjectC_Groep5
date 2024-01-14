"use client";
import styles from "./page.module.css";
import Container from "@/app/components/Container";
import { useState, useEffect, useId } from "react";

interface Question {
    options: string[];
    question: string;
    correctAnswer: string;
}

interface Quiz {
    id?: number;
    title: string;
    questions: Question[];
    points: number;
}

const Page = () => {
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | undefined>();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [sortType, setSortType] = useState<'id' | 'title' | 'points'>('id');
    const [filterType, setFilterType] = useState<'id' | 'title'>('title');


    const dialogTitle = useId();
    const dialogQuestions = useId();
    const dialogPoints = useId();

    const fetchQuizzes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/quizzesBeheer`);
            if (!response.ok) throw new Error('Failed to fetch quizzes');
            const data = await response.json();
            const sortedData = sortQuizzes(data);
            setQuizzes(sortedData);
            setFilteredQuizzes(sortedData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sortQuizzes = (quizzes: Quiz[]) => {
        switch (sortType) {
            case 'id':
                return [...quizzes].sort((a, b) => (a.id && b.id) ? a.id - b.id : 0);
            case 'title':
                return [...quizzes].sort((a, b) => a.title.localeCompare(b.title));
            case 'points':
                return [...quizzes].sort((a, b) => a.points - b.points);
            default:
                return quizzes;
        }
    };

    const handleSearch = (event: any) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        if (value.trim() === "") {
            setFilteredQuizzes(sortQuizzes(quizzes));
            return;
        }
        let filtered;
        if (filterType === 'id') {
            const searchId = parseInt(value, 10);
            filtered = quizzes.filter(quiz => quiz.id === searchId);
        } else {
            filtered = quizzes.filter(quiz => quiz.title.toLowerCase().includes(value));
        }
        setFilteredQuizzes(sortQuizzes(filtered));
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    useEffect(() => {
        setFilteredQuizzes(sortQuizzes(quizzes));
    }, [sortType]);


    const openNewQuizDialog = () => {
        setCurrentQuiz({ title: '', questions: [], points: 0 });
        setShowDialog(true);
    };

    const handleAddQuestion = () => {
        setCurrentQuiz(prev => {
            const newQuestion = { question: '', options: ['', '', '', ''], correctAnswer: '' };
            return {
                ...prev ?? { title: '', questions: [], points: 0 },
                questions: [...(prev?.questions ?? []), newQuestion]
            };
        });
    };

    const handleQuestionChange = (index: number, field: keyof Question, value: string | string[]) => {
        setCurrentQuiz(prev => {
            const updatedQuestions = prev?.questions.map((q, i) => {
                if (i === index) {
                    return { ...q, [field]: value };
                }
                return q;
            }) ?? [];
            return { ...prev ?? { title: '', questions: [], points: 0 }, questions: updatedQuestions };
        });
    };


    const updateField = <K extends keyof Quiz>(field: K, value: Quiz[K]) => {
        setCurrentQuiz((prev) => {
            return prev ? { ...prev, [field]: value } : prev;
        });
    };

    const handleSaveQuiz = async () => {
        const method = currentQuiz?.id ? "PUT" : "POST";
        const endpoint = currentQuiz?.id
            ? `/api/quizzesBeheer?id=${currentQuiz.id}`
            : `/api/quizzesBeheer`;
        const response = await fetch(endpoint, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentQuiz),
        });

        if (!response.ok) {
            console.error("Failed to save quiz");
            return;
        }

        setShowDialog(false);
        fetchQuizzes();
    };

    const handleDeleteQuiz = async (id: number | undefined) => {
        if (id === undefined) {
            console.error('Error: No ID provided for deletion.');
            return;
        }

        if (!window.confirm("Weet je zeker dat je deze Quiz wilt verwijderen?")) {
            return;
        }

        const response = await fetch(`/api/quizzesBeheer?id=${id}`, { method: 'DELETE' });
        if (!response.ok) {
            console.error('Failed to delete quiz');
            return;
        }
        fetchQuizzes();
    };

    const handleOptionChange = (questionIndex: number, optionIndex: number, newValue: string) => {
        setCurrentQuiz((prevQuiz) => {
            if (!prevQuiz) return prevQuiz;
            const updatedQuestions = [...prevQuiz.questions];
            const updatedOptions = [...updatedQuestions[questionIndex].options];
            updatedOptions[optionIndex] = newValue;
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                options: updatedOptions,
            };
            return { ...prevQuiz, questions: updatedQuestions };
        });
    };



    useEffect(() => {
        fetchQuizzes();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container title="Quizzes Beheer">
            <div className={styles.filterOptions}>
                <select
                    className={styles.select}
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'id' | 'title')}
                >
                    <option value="id">ID</option>
                    <option value="title">Titel</option>
                </select>
                <input
                    type={filterType === 'id' ? 'number' : 'text'}
                    placeholder={`Zoek op ${filterType}...`}
                    className={styles.search}
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className={styles.sortOptions}>
                <select
                    className={styles.select}
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value as 'id' | 'title' | 'points')}
                >
                    <option value="id">Sorteer op ID</option>
                    <option value="title">Sorteer op Titel</option>
                    <option value="points">Sorteer op Punten</option>
                </select>
            </div>
            <button className={styles.add} onClick={openNewQuizDialog}>
                Voeg een nieuwe Quiz toe
            </button>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titel</th>
                        <th>Vragen</th>
                        <th>Punten</th>
                        <th>Acties</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredQuizzes.map((quiz) => (
                        <tr key={quiz.id}>
                            <td>{quiz.id}</td>
                            <td>{quiz.title}</td>
                            <td>
                                {quiz.questions.map((q, index) => (
                                    <div key={index}>
                                        <div>Question: {q.question}</div>
                                        <div>Options: {q.options.join(', ')}</div>
                                        <div>Correct Answer: {q.correctAnswer}</div>
                                    </div>
                                ))}
                            </td>
                            <td>{quiz.points}</td>
                            <td>
                                <button
                                    className={styles.edit}
                                    onClick={() => {
                                        setCurrentQuiz(quiz);
                                        setShowDialog(true);
                                    }}
                                >
                                    <i className="symbol">edit</i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDialog && (
                <div className={styles.dialogBackdrop}>
                    <div className={styles.dialog}>
                        <label htmlFor={dialogTitle}>Title</label>
                        <input
                            id={dialogTitle}
                            value={currentQuiz?.title || ""}
                            onChange={(e) => updateField('title', e.target.value)}
                        />
                        {currentQuiz?.questions.map((question, index) => (
                            <div key={index}>
                                <label htmlFor={dialogTitle}>Question </label>
                                <input
                                    type="text"
                                    value={question.question}
                                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                    placeholder="Question"
                                />
                                {question.options.map((option, optIndex) => (
                                    <input
                                        key={optIndex}
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                        placeholder={`Option ${optIndex + 1}`}
                                    />
                                ))}
                                <label htmlFor={dialogTitle}>Correct Answer: </label>
                                <input
                                    type="text"
                                    value={question.correctAnswer}
                                    onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                                    placeholder="Correct Answer"
                                />
                            </div>
                        ))}
                        <button className={styles.button} onClick={handleAddQuestion}>Vraag Toevoegen</button>
                        <label htmlFor={dialogPoints}>Points</label>
                        <input
                            type="number"
                            id={dialogPoints}
                            value={currentQuiz?.points || 0}
                            onChange={(e) => updateField('points', Number(e.target.value))}
                        />
                        <button className={styles.button} onClick={handleSaveQuiz}>Opslaan</button>
                        <button className={styles.button} onClick={() => handleDeleteQuiz(currentQuiz?.id)}>Verwijderen</button>
                        <button className={styles.button} onClick={() => setShowDialog(false)}>Sluiten</button>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default Page;