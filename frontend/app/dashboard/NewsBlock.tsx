import styles from "./NewsBlock.module.css";
import Container from "../components/Container";

interface Article {
  title: string;
  summary: string;
  date: Date;
  url: URL;
}

const NewsBlock: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <section className={className}>
      <Container title="Recente Nieuws">
        <article className={styles.article}>
          <div className={styles.articleImage}></div>
          <h2 className={styles.articleTitle}>
            Excepteur sint occaecat cupidatat non proident.
          </h2>
          <p className={styles.articleSummary}>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est eopksio laborum.
          </p>
        </article>
      </Container>
    </section>
  );
};
export default NewsBlock;
