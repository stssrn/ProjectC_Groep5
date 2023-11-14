"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



const Quote = () => {

    const quotes: string[] = [
        '"De zorg is super tof!"',
        '"Leuk dat je erbij bent!"',
        '"Coole quote nummer 3"'
    ];

    const [currentQuote, setCurrentQuote] = useState<string | null>(null);
    const router = useRouter();

    const displayRandomQuote = () => {
      const randomIndex: number = Math.floor(Math.random() * quotes.length);
      const randomQuote: string = quotes[randomIndex];
      setCurrentQuote(randomQuote);
    };

    useEffect(() => {
      displayRandomQuote();
      const timer = setTimeout(() => {
        router.replace("/login")
      }, 30000000);
      return () => clearTimeout(timer);
    }, []);

    return (
        <div className={ styles.quoteText }>
            {currentQuote && <p>{currentQuote}</p>}
        </div>
    );

};

export default Quote;