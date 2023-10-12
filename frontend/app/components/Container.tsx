import styles from "./Container.module.css";

const Container: React.FC<{
  title: string;
  padding?: number;
  children?: React.ReactNode;
}> = ({ children, title, padding}) => {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.childrenWrapper} style={{padding}}>
        {children}
      </div>
    </section>
  );
};

export default Container;
