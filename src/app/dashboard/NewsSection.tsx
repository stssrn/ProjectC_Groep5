"use client";
import styles from "./NewsSection.module.css";
import Container from "../components/Container";
import clsx from "clsx";
import { useState, useEffect } from 'react';

import content from "./pictures_education/content.jpg";
import brug from "./pictures_news/gebouw.jpg";
import gebouw1 from "./pictures_news/Zorgcampus.jpg";
import gebouw2 from "./pictures_news/kra.jpg";
import kliniek from "./pictures_news/kliniek.jpg";
import man from "./pictures_news/man-4957154_1920.jpg";
import banen from "./pictures_news/banenbers.jpg";
import Image, { StaticImageData } from "next/image";

interface Article {
  title: string;
  content: string;
  date: Date;
  url: URL;
  image: StaticImageData
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const allImages = [content, brug, gebouw1, gebouw2, kliniek, man, banen];
const getRandomImage = (randomNumb: number) => {
  return allImages[randomNumb];
}
const fetchRandomArticles = async () => {
  try {
    const response = await fetch(`api/newsArticles?id=${0}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch newsArticles data");
    }

    const fetchedData = await response.json();

    let getRandomNumber1 = getRandomNumber(0, fetchedData.newsArticles.length);
    let getRandomNumber2 = getRandomNumber(0, fetchedData.newsArticles.length);
    if (getRandomNumber1 === getRandomNumber2) {
      getRandomNumber2 = getRandomNumber(0, fetchedData.newsArticleslength);
    }
    let getRandomNumber3 = getRandomNumber(0, fetchedData.newsArticles.length);
    if (getRandomNumber3 === getRandomNumber1 || getRandomNumber3 === getRandomNumber2) {
      getRandomNumber3 = getRandomNumber(0, fetchedData.newsArticles.length);
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

    if (fetchedData) {
      //console.log(fetchedData)
      const random_articles = [
        {
          title: fetchedData.newsArticles[getRandomNumber1].title,
          content: fetchedData.newsArticles[getRandomNumber1].content,
          date: new Date(),
          url: new URL(fetchedData.newsArticles[getRandomNumber1].url),
          image: getRandomImage(getRandomNumber4)
        },
        {
          title: fetchedData.newsArticles[getRandomNumber2].title,
          content: fetchedData.newsArticles[getRandomNumber2].content,
          date: new Date(),
          url: new URL(fetchedData.newsArticles[getRandomNumber2].url),
          image: getRandomImage(getRandomNumber5)
        },
        {
          title: fetchedData.newsArticles[getRandomNumber3].title,
          content: fetchedData.newsArticles[getRandomNumber3].content,
          date: new Date(),
          url: new URL(fetchedData.newsArticles[getRandomNumber3].url),
          image: getRandomImage(getRandomNumber6)
        },
      ];

      return random_articles;
    }
    else {
      console.error("Unexpected data structure in API response:", fetchedData);
    }
  } catch (error) {
    console.error("Error fetching newsArticles data:", error);
  }
};


const getDateString = Intl.DateTimeFormat("nl", {
  month: "short",
  day: "numeric",
}).format;


const NewsBlock: React.FC<{
  className?: string;
}> = ({ className }) => {

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const Articles = await fetchRandomArticles();
      if (Articles) {
        setArticles(Articles);
        // console.log(Articles)
      }
    };

    fetchData();
  }, []);
  return (
    <section className={className}>
      <Container padding={12} title="Recente Nieuws">
        {articles && (
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
                  <p className={styles.articleSummary}>{article.content}</p>
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
        )}
      </Container>
    </section>
  );
};
export default NewsBlock;
