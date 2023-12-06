"use client";
import React from "react";
import styles from "./page.module.css";
import Container from "../components/Container";

const Page = () => {
    return (
        <Container title="Bug Melden">
            <div>
                <h1 className={styles.thankYouMsg}>Bedankt voor het ondersteunen van ons platform door fouten aan te geven</h1>
            </div>
            <div className={ styles.inputField }>
                <input
                    className={styles.inputBox}
                    type="text"
                    placeholder="Geef hier aan wat er mis ging..."
                ></input>
            </div>
        </Container>
    );
};

export default Page;