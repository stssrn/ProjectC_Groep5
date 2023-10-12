import styles from "./page.module.css";
import NewsBlock from "./NewsBlock";
import AgendaBlock from "./AgendaBlock";

const Page: React.FC = () => {
  return (
    <main className={styles.blocks}>
      <NewsBlock className={styles.news}/>
      <AgendaBlock className={styles.quiz}/>
    </main>
  );
};

export default Page;
