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
    const [fadeState, setFadeState] = useState<'fadeIn' | 'fadeOut' | ''>(''); 
    const router = useRouter();

    const displayRandomQuote = () => {
      const randomIndex: number = Math.floor(Math.random() * quotes.length);
      const randomQuote: string = quotes[randomIndex];
        setCurrentQuote(randomQuote);

        setTimeout(() => {
            setFadeState('fadeIn');
        }, 250);

        setTimeout(() => {
            setFadeState('fadeOut');
        }, 2500);
    };

    useEffect(() => {
      displayRandomQuote();
      const timer = setTimeout(() => {
        router.replace("/login")
      }, 3500);
      return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`${styles.quoteText} ${styles[fadeState]}`}>
            {currentQuote && <p>{currentQuote}</p>}
        </div>
    );

};

export default Quote;