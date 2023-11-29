"use client";
import Joyride, { Step } from 'react-joyride';
import stylestour from "./stylestour.module.css";
import React, { useState, useEffect } from 'react';
import styles from "../dashboard/page.module.css";
import NewsSection from "../dashboard/NewsSection";
import AgendaSection from "../dashboard/AgendaSection";
import ForumSection from "../dashboard/ForumSection";
import QuizSection from "../dashboard/QuizSection";
import EducationSection from "../dashboard/EducationSection";
import LayoutModule from "../layout.module.css";

const Page: React.FC = () => {
    const [run, setRun] = useState(false);

    const steps: Step[] = [
        {
            target: `.${styles.news}`,
            content: 'Welkom bij de nieuwssectie! Hier staan de meest recente nieuwtjes binnen Antes.',
        },
        {
            target: `.${styles.forum}`,
            content: 'Verken het forumgedeelte om in contact te komen met de community en verschillende onderwerpen te bespreken',
        },
        {
            target: `.${styles.quiz}`,
            content: 'In de Quiz-sectie kun je je progressie zien van de quiz en je kennis testen.',
        },
        {
            target: `.${styles.education}`,
            content: 'De E-learning sectie biedt waardevolle informatie en leermiddelen.',
        },
        {
            target: `.${styles.agenda}`,
            content: 'Bekijk de Agenda-sectie om op de hoogte te blijven van aankomende evenementen en activiteiten.',
        },
        {
            target: `.${LayoutModule.nav}`,
            content: 'Gebruik de navigatie balk aan de rechterzijde om ons platform verder te verkennen.',
            placement: 'center',
            isFixed: true,
        },
    ];

    const joyrideOptions = {
        steps: steps,
        run: run,
        continuous: true,
        locale: {
            back: 'Vorige',
            next: 'Volgende',
            last: 'Sluiten',
            skip: 'Overslaan',
        },
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRun(true);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <main className={styles.blocks}>
            <NewsSection className={styles.news} />
            <ForumSection className={styles.forum} />
            <QuizSection className={styles.quiz} />
            <EducationSection className={styles.education} />
            <AgendaSection className={styles.agenda} />

            <Joyride {...joyrideOptions} />
        </main>
    );
};

export default Page;
