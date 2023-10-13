import styles from "./page.module.css";
import NewsSection from "./NewsSection";
import AgendaSection from "./AgendaSection";

const Page: React.FC = () => {
  return (
    <main className={styles.blocks}>
      <NewsSection className={styles.news}/>
      <AgendaSection className={styles.quiz}/>
    </main>
  );
};

export default Page;
