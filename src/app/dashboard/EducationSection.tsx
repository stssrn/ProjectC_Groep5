"use client";
import styles from "./EducationSection.module.css";
import Container from "../components/Container";
import clsx from "clsx";
import { useState, useEffect } from 'react';
import vrouw_vrouw from "./pictures_education/vrouw_vrouw.jpg";
import man_vrouw from "./pictures_education/man_vrouw.png";
import vrouw_donker_haar from "./pictures_education/vrouw_donker_haar.jpg";
import content from "./pictures_education/content.jpg";
import drie_meisjes from "./pictures_education/la-drie-meisjes.jpg";
import jongen_muur from "./pictures_education/jongen_muur.jpg";
import kids_gamen from "./pictures_education/kids-gamen.jpg";
import Image, { StaticImageData } from "next/image";

interface Learn {
    id: number;
    title: string;
    description: string;
    date?: Date;
    url?: URL;
    image: StaticImageData
}

function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}
const allImages = [vrouw_vrouw, man_vrouw, vrouw_donker_haar, content, drie_meisjes, jongen_muur, kids_gamen];
const getRandomImage = (randomNumb: number) => {
    return allImages[randomNumb];
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

        let getRandomNumber4 = getRandomNumber(0, allImages.length);
        let getRandomNumber5 = getRandomNumber(0, allImages.length);
        if (getRandomNumber4 === getRandomNumber5) {
            getRandomNumber5 = getRandomNumber(0, allImages.length);
        }
        let getRandomNumber6 = getRandomNumber(0, allImages.length);
        if (getRandomNumber6 === getRandomNumber4 || getRandomNumber6 === getRandomNumber5) {
            getRandomNumber6 = getRandomNumber(0, allImages.length);
        }


        const random_modules = [
            {
                id: fetchedData.educatieModules[getRandomNumber1].id,
                title: fetchedData.educatieModules[getRandomNumber1].title,
                description: fetchedData.educatieModules[getRandomNumber1].description,
                date: new Date(),
                url: new URL("https://anteszorg.nl/"),
                image: getRandomImage(getRandomNumber4)
            },
            {
                id: fetchedData.educatieModules[getRandomNumber2].id,
                title: fetchedData.educatieModules[getRandomNumber2].title,
                description: fetchedData.educatieModules[getRandomNumber2].description,
                date: new Date(),
                url: new URL("https://anteszorg.nl/"),
                image: getRandomImage(getRandomNumber5)
            },
            {
                id: fetchedData.educatieModules[getRandomNumber3].id,
                title: fetchedData.educatieModules[getRandomNumber3].title,
                description: fetchedData.educatieModules[getRandomNumber3].description,
                date: new Date(),
                url: new URL("https://anteszorg.nl/"),
                image: getRandomImage(getRandomNumber6)
            },
        ];

        return random_modules;
    } catch (error) {
        console.error("Error fetching educatie_modules data:", error);
    }
};



const getDateString = Intl.DateTimeFormat("nl", {
    month: "short",
    day: "numeric",
}).format;


const EducationBlock: React.FC<{
    className?: string;
}> = ({ className }) => {

    const [articles, setArticles] = useState<Learn[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const modules = await fetchRandomModules();
            if (modules) {
                setArticles(modules);
            }
        };

        fetchData();
    }, []);
    return (
        <section className={className}>
            <Container padding={12} title="Educatie">
                <div className={styles.articles}>
                    {articles.map((article, i) => (
                        <article key={i} className={styles.article}>
                            <div className={styles.top}>
                                <div className={styles.topOverlay}></div>
                                <div>
                                    <Image
                                        className={styles.articleImage}
                                        src={article.image?.src}
                                        alt="education image"
                                        height={200}
                                        width={200}
                                    />
                                </div>
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
                                    {getDateString(article.date)}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </Container>
        </section>


    );

};
export default EducationBlock;
