"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Container from "../components/Container";

const Page = () => {
    const [inputValue, setInputValue] = useState("");
    const [inputError, setInputError] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const sendData = () => {
        setSuccessMessage("");
        if (inputValue.trim() !== "") {
            const jsonData = {
                message: inputValue,
            };
            const jsonString = JSON.stringify(jsonData);

            // You can now send the jsonString to your server or save it to a file
            console.log(jsonString);

            setInputValue("");
            setInputError(false);
            setSuccessMessage("Bedankt voor je feedback!");

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } else {
            setInputError(true);
        }
    };

    return (
        <Container title="Bug Melden">
            <div>
                <h1 className={styles.thankYouMsg}>
                    Bedankt voor het ondersteunen van ons platform door fouten aan te geven
                </h1>
            </div>
            <div className={styles.inputField}>
                <input
                    className={`${styles.inputBox} ${inputError ? styles.inputBoxError : ""}`}
                    type="text"
                    placeholder="Geef hier aan wat er mis ging..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>
            <div className={styles.sendDiv}>
                <button className={styles.sendBut} onClick={sendData}>
                    versturen
                </button>
            </div>
            {successMessage && (
                <div className={styles.successMessage}>{successMessage}</div>
            )}
        </Container>
    );
};

export default Page;
