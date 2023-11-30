"use client";
import Container from "../../components/Container";
import Image from "next/image";
import image from "./image.svg";
import styles from "./page.module.css";
import { useState } from "react";
import Link from "next/link";

const Page = () => {
    const storedStep = localStorage.getItem("currentStep");
    const initialStep = storedStep ? parseInt(storedStep, 10) : 1;

    const [currentStep, setCurrentStep] = useState(initialStep);

    const handleStepChange = (step: number) => {
        setCurrentStep(step);
        localStorage.setItem("currentStep", String(step));
    };

    return (
        < main className={styles.forgotPassword} >
            {currentStep === 1 && (
                <div className={styles.stepOne}>
                    <div className={styles.left}>
                        <h1 className={styles.loginTitle}>Wachtwoord Vergeten</h1>
                        <div className={styles.form}>
                            <input className={styles.textbox} placeholder="email" type="email" name="" id="" />
                            <button className={styles.continuePasswordChange} onClick={() => handleStepChange(currentStep + 1)}>code verzenden</button>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <Image className={styles.image} src={image} alt="" />
                    </div>
                </div>
            )}
            {currentStep === 2 && (
                <div className={styles.stepTwo}>
                    <div className={styles.left}>
                        <h1 className={styles.loginTitle}>Code invoeren</h1>
                        <div className={styles.form}>
                            <input className={styles.textbox} placeholder="code" type="tekst" name="" id="" />
                            <button className={styles.continuePasswordChange} onClick={() => handleStepChange(currentStep + 1)}>volgende stap</button>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <Image className={styles.image} src={image} alt="" />
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className={styles.stepThree}>
                    <div className={styles.left}>
                        <h1 className={styles.loginTitle}>Nieuw wachtwoord</h1>
                        <div className={styles.form}>
                            <input className={styles.textbox} placeholder="wachtwoord" type="password" name="" id="" />
                            <input className={styles.textbox} placeholder="herhaal wachtwoord" type="password" name="" id="" />
                            <Link href="/login" className={styles.continuePasswordChange} onClick={() => handleStepChange(1)}>
                                Wachtwoord veranderen
                            </Link>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <Image className={styles.image} src={image} alt="" />
                    </div>
                </div>
            )
            }
        </main >
    );
};

export default Page;
