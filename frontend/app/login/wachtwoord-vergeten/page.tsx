"use client";
import Container from "../../components/Container";
import Image from "next/image";
import image from "./image.svg";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

const Page = () => {
    const [currentStep, setCurrentStep] = useState(
        parseInt(localStorage.getItem("currentStep") || "1", 10)
    );

    const handleStepChange = (step: number) => {
        setCurrentStep(step);
        // Save the currentStep to localStorage
        localStorage.setItem("currentStep", String(step));
    };

    useEffect(() => {
        // Cleanup function to be executed when the component is unmounted
        return () => {
            // Reset currentStep to 1 when leaving the page
            setCurrentStep(1);
            localStorage.removeItem("currentStep");
        };
    }, []);

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
                            <Link href="/login" className={styles.continuePasswordChange}>
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
