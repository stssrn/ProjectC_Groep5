"use client";
import Image from "next/image";
import styles from "./page.module.css";
import image from "./image.svg";
import { useId } from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


const Page = () => {
    const checkboxId = useId();
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
        setShowPopup(true);
    };

    const handleYes = () => {
        router.push("/tour");
        setShowPopup(false);
    };

    const handleNo = () => {
        router.push("/dashboard");
        setShowPopup(false);
    };

    return (
        <main className={styles.loginContainer}>
            <div className={styles.left}>
                <h1 className={styles.loginTitle}>Inloggen</h1>
                <div className={styles.form}>
                    <input className={styles.textbox} placeholder="email" type="email" name="" id="" />
                    <input className={styles.textbox} placeholder="wachtwoord" type="password" name="" id="" />
                    <div className={styles.checkboxWrapper}>
                        <label className={styles.label} htmlFor={checkboxId}>
                            Blijf ingelogd
                        </label>
                        <input className={styles.checkbox} type="checkbox" name="" id={checkboxId} />
                    </div>
                    <Link className={styles.forgotPassword} href="/login/wachtwoord-vergeten">
                        Wachtwoord vergeten?
                    </Link>
                    <button className={styles.loginButton} onClick={handleLogin}>
                        Inloggen
                    </button>
                </div>
            </div>
            <div className={styles.right}>
                <Image className={styles.image} src={image} alt="" />
            </div>

            {showPopup && (
                <div className={styles.popupContainer}>
                    <div className={styles.popup}>
                        <p>We zien dat dit de eerste keer is dat je inlogd. Wil je een tour van de applicatie?</p>
                        <button onClick={handleYes}>Breng me naar de tour</button>
                        <button onClick={handleNo}>Overslaan</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Page;
