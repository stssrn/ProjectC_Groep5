import styles from "./Column.module.css";

const Column: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className={styles.container}>
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
    </div>
    <div className={styles.children}>{children}</div>
  </div>
);

export default Column;
