"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";



const Quote = () => {

    const quotes: string[] = [
        "De zorg is geweldig!",
        "Leuk dat je erbij bent!",
        "Coole quote numero 3"
    ];

    const [currentQuote, setCurrentQuote] = useState<string | null>(null);

    const displayRandomQuote = () => {
        const randomIndex: number = Math.floor(Math.random() * quotes.length);
        const randomQuote: string = quotes[randomIndex];
        setCurrentQuote(randomQuote);

        setTimeout(() => {
            redirect("/login");
        }, 3000);

    };

    useEffect(() => {
        displayRandomQuote();
    }, []);

    return (
        <div>
            <p>Random Quote:</p>
            {currentQuote && <p>{currentQuote}</p>}
        </div>
    );

};

export default Quote;