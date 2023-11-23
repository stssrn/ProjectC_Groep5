import styles from "./page.module.css";
import NewsSection from "./NewsSection";
import AgendaSection from "./AgendaSection";
import ForumSection from "./ForumSection";
import QuizSection from "./QuizSection";
import EducationSection from "./EducationSection";

const Page: React.FC = () => {
  return (
    <main className={styles.blocks}>
      <NewsSection className={styles.news} />
      <ForumSection className={styles.forum} />
      <QuizSection className={styles.quiz} />
      <EducationSection className={styles.education} />
      <AgendaSection className={styles.agenda} />
    </main>
  );
};

export default Page;
