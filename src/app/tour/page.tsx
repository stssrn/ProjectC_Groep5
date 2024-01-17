"use client";

import { useState, useEffect } from "react";
import { CallBackProps, Step, STATUS } from "react-joyride";
import { redirect } from "next/navigation";

import styles from "../dashboard/page.module.css";
import LayoutModule from "../layout.module.css";
import forumThumbnail from "../gebruiker/male.svg";

import JoyRideNoSSR from "../components/JoyRideNoSSR";
import NewsSection from "../dashboard/NewsSection";
import AgendaSection from "../dashboard/AgendaSection";
import ForumSectionWidget from "../dashboard/ForumSectionWidget";
import QuizSection from "../dashboard/QuizSection";
import EducationSection from "../dashboard/EducationSection";

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
            content: 'Je kunt punten verdienen door quizzes te maken en actief te zijn op ons platform. Deze punten kun je uitgeven in de puntenwinkel. Gebruik de navigatie balk aan de rechterzijde om ons platform verder te verkennen.',
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

    const joyrideCallback = (data: CallBackProps) => {
        if (data.status === STATUS.FINISHED) {
            redirect("/dashboard")
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRun(true);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    const post: React.ComponentProps<
        typeof ForumSectionWidget
    >["posts"][number] = {
        id: -1,
        thumbnailUrl: forumThumbnail.src,
        title: "Discussie Titel",
        content: "Hier zie je de inhoud van een post.",
        userFullname: "Tour",
        username: "",
        commentCount: 0,
    };

    const examplePosts = Array(3).fill(post);

    return (
        <main className={styles.blocks}>
            <NewsSection className={styles.news} />
            <ForumSectionWidget className={styles.forum} posts={examplePosts} />
            <QuizSection className={styles.quiz} />
            <EducationSection className={styles.education} />
            <AgendaSection className={styles.agenda} />

            <JoyRideNoSSR {...joyrideOptions} callback={joyrideCallback} />
        </main>
    );
};

export default Page;
