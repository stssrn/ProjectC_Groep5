"use client";
import styles from "./page.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



const Quote = () => {
    const router = useRouter();

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
            router.push("/login");
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