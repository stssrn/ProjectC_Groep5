import styles from "./page.module.css";
import NewsBlock from "./NewsBlock";

const page = () => {
  return (
    <main className={styles.blocks}>
      <NewsBlock></NewsBlock>
    </main>
  );
};

export default page;
