"use client";
import styles from "./EducationSection.module.css";
import Container from "../components/Container";
import clsx from "clsx";
import { useState, useEffect } from 'react';

interface Learn {
    id: number;
    title: string;
    description: string;
    date?: Date;
    url?: URL;
}


const EducationBlock = () => {

    const [articles, setArticles] = useState<Learn[]>([]);

    function getRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    const fetchRandomModules = async () => {
        try {
            const response = await fetch(`api/educatie?id=${0}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch educatie_modules data");
            }

            const fetchedData = await response.json();

            let getRandomNumber1 = getRandomNumber(0, fetchedData.educatieModules.length);
            let getRandomNumber2 = getRandomNumber(0, fetchedData.educatieModules.length);
            if (getRandomNumber1 === getRandomNumber2) {
                getRandomNumber2 = getRandomNumber(0, fetchedData.educatieModules.length);
            }
            let getRandomNumber3 = getRandomNumber(0, fetchedData.educatieModules.length);
            if (getRandomNumber3 === getRandomNumber1 || getRandomNumber3 === getRandomNumber2) {
                getRandomNumber3 = getRandomNumber(0, fetchedData.educatieModules.length);
            }

            const random_modules = [
                {
                    id: fetchedData.educatieModules[getRandomNumber1].id,
                    title: fetchedData.educatieModules[getRandomNumber1].title,
                    description: fetchedData.educatieModules[getRandomNumber1].description,
                    url: new URL("https://anteszorg.nl/")
                },
                {
                    id: fetchedData.educatieModules[getRandomNumber2].id,
                    title: fetchedData.educatieModules[getRandomNumber2].title,
                    description: fetchedData.educatieModules[getRandomNumber2].description,
                    url: new URL("https://anteszorg.nl/")
                },
                {
                    id: fetchedData.educatieModules[getRandomNumber3].id,
                    title: fetchedData.educatieModules[getRandomNumber3].title,
                    description: fetchedData.educatieModules[getRandomNumber3].description,
                    url: new URL("https://anteszorg.nl/")
                },
            ];

            return random_modules;
        } catch (error) {
            console.error("Error fetching educatie_modules data:", error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            const modules = await fetchRandomModules();
            if (modules) {
                setArticles((prevArticles) => {
                    return modules;
                });
            }
        };
        fetchData();
    }, []);




    return (
        <Container padding={12} title="Educatie">
            <div className={styles.articles}>
                {articles.length > 0 ? (
                    articles.map((article, i) => (
                        <article key={i} className={styles.article}>
                            <div className={styles.top}>
                                <div className={styles.topOverlay}></div>
                                <div className={styles.articleImage}></div>
                                <h2 className={styles.articleTitle}>{article.title}</h2>
                                <p className={styles.articleSummary}>{article.description}</p>
                            </div>
                            <div className={styles.bottom}>
                                <div className={styles.bottomSection}>
                                    <i className={clsx("symbol", styles.symbol)}>link</i>
                                    {article?.url?.host}
                                </div>
                                <div className={styles.bottomSection}>
                                    <i className={clsx("symbol", styles.symbol)}>schedule</i>
                                    {/*getDateString(article.date)*/}
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <p>No articles</p>
                )}
            </div>
        </Container>
    );

};
export default EducationBlock;
