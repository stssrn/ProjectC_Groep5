"use client";
import styles from "./NewsSection.module.css";
import Container from "../components/Container";
import clsx from "clsx";
import { useState, useEffect } from 'react';

interface Article {
  title?: string;
  content?: string;
  date?: Date;
  url?: URL;
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
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
    if (fetchedData) {
      const random_articles = [
        {
          title: fetchedData.newsArticles[getRandomNumber1].title,
          content: fetchedData.newsArticles[getRandomNumber1].content,
          date: new Date(),
          url: new URL(fetchedData.newsArticles[getRandomNumber1].url)
        },
        {
          title: fetchedData.newsArticles[getRandomNumber2].title,
          content: fetchedData.newsArticles[getRandomNumber2].content,
          date: new Date(),
          url: new URL(fetchedData.newsArticles[getRandomNumber2].url)
        },
        {
          title: fetchedData.newsArticles[getRandomNumber3].title,
          content: fetchedData.newsArticles[getRandomNumber3].content,
          date: new Date(),
          url: new URL(fetchedData.newsArticles[getRandomNumber3].url)
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
      }
    };

    fetchData();
  }, []);
  return (
    <section className={className}>
      <Container padding={12} title="Recente Nieuws">
        <div className={styles.articles}>
          {articles.map((article, i) => (
            <article key={i} className={styles.article}>
              <div className={styles.top}>
                <div className={styles.topOverlay}></div>
                <div className={styles.articleImage}></div>
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
      </Container>
    </section>
  );
};
export default NewsBlock;
