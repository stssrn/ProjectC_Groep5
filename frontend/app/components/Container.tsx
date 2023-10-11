import styles from "./Container.module.css";

const Container: React.FC<{
  title: string;
  children?: React.ReactNode;
}> = (props) => {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{props.title}</h1>
      </div>
      <div className={styles.childrenWrapper}>
        {props.children}
      </div>
    </section>
  );
};

export default Container;
