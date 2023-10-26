import styles from "./NewsSection.module.css";
import Container from "../components/Container";
import clsx from "clsx";

interface Article {
  title: string;
  summary: string;
  date: Date;
  url: URL;
}

const article: Article = {
  title: "Excepteur sint occaecat cupidatat non proident.",
  summary:
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum.",
  date: new Date(),
  url: new URL("https://anteszorg.nl/"),
};

const articles: Article[] = new Array(3).fill(article);
const getDateString = Intl.DateTimeFormat("nl", {
  month: "short",
  day: "numeric",
}).format;
const NewsBlock: React.FC<{
  className?: string;
}> = ({ className }) => {
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
                <p className={styles.articleSummary}>{article.summary}</p>
              </div>
              <div className={styles.bottom}>
                <div className={styles.bottomSection}>
                  <i className={clsx("symbol", styles.symbol)}>link</i>
                  {article.url.host}
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
