import styles from "./Container.module.css";
import clsx from "clsx";

const Container: React.FC<{
  title: string;
  padding?: number;
  className?: string;
  children?: React.ReactNode;
}> = ({ children, title, className, padding}) => {
  return (
    <section className={clsx(styles.container, className)}>
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
