import Image from "next/image";
import styles from "./page.module.css";
import image from "./image.svg";
import { useId } from "react";
import Link from "next/link";

const Page = () => {
  const checkboxId = useId();

  return (
    <main className={styles.loginContainer}>
      <div className={styles.left}>
        <h1 className={styles.loginTitle}>Inloggen</h1>
        <div className={styles.form}>
          <input
            className={styles.textbox}
            placeholder="email"
            type="email"
            name=""
            id=""
          />
          <input
            className={styles.textbox}
            placeholder="wachtwoord"
            type="password"
            name=""
            id=""
          />
          <div className={styles.checkboxWrapper}>
            <label className={styles.label} htmlFor={checkboxId}>
              Blijf ingelogd
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              name=""
              id={checkboxId}
            />
          </div>
          <Link
            className={styles.forgotPassword}
            href="/login/wachtwoord-vergeten"
          >
            Wachtwoord vergeten?
          </Link>
          <Link href="/dashboard" className={styles.loginButton}>
            Inloggen
          </Link>
        </div>
      </div>
      <div className={styles.right}>
        <Image className={styles.image} src={image} alt="" />
      </div>
    </main>
  );
};

export default Page;
