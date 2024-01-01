"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Container from "../components/Container";
import { useSession } from "next-auth/react";

const Page = () => {
    const [inputValue, setInputValue] = useState("");
    const [titleValue, setTitleValue] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const { data: session } = useSession();
    const [lastBugReportId, setLastBugReportId] = useState(0);

    const sendData = async () => {
        setSuccessMessage("");
        setTitleError(false);
        setInputError(false);

        if (titleValue.trim() !== "") {
            setTitleError(false);

            if (inputValue.trim() !== "") {
                try {
                    await sendReportToBug();
                    await fetchLastBugReportId(); // Wait for fetchLastBugReportId to complete

                    //console.log(lastBugReportId);
                    sendReportToBugUser(Number(lastBugReportId) + 1);

                    setInputValue("");
                    setTitleValue("");
                    setInputError(false);
                    setSuccessMessage("Bedankt voor je feedback!");

                    setTimeout(() => {
                        setSuccessMessage("");
                    }, 3000);
                } catch (error) {
                    console.error("Error sending data:", error);
                }
            } else {
                setInputError(true);
            }
        } else {
            setTitleError(true);
        }
    };
    const fetchLastBugReportId = async () => {
        try {
            const response = await fetch(`api/bug?id=${0}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch bug report data");
            const data = await response.json();
            //console.log("data: ");
            //console.log(data);
            //console.log(data.formattedBugs[data.formattedBugs.length - 1]);
            //console.log(Number(data.formattedBugs[data.formattedBugs.length - 1].id))


            await setLastBugReportId(Number(data.formattedBugs[data.formattedBugs.length - 1].id));

        } catch (error) {
            console.error("Error fetching bug report data:", error);
        }
    };

    const sendReportToBug = async () => {
        try {
            //console.log("save sign in");
            const response = await fetch("api/bug", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: titleValue,
                    description: inputValue,
                    date: new Date(Date.now()),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add bug report data");
            }
        } catch (error) {
            console.error("Error updating bug report data:", error);
        }
    };

    const sendReportToBugUser = async (bugId: number) => {
        try {
            //console.log("save sign in");
            //console.log("bugUser:");
            //console.log(bugId + " " + session?.user?.id);
            const response = await fetch("api/bugUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bugId: bugId,
                    userId: Number(session?.user?.id),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add bug and/or user data");
            }
        } catch (error) {
            console.error("Error updating bug and/or user data:", error);
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
        }
    }, [session]);

    return (
        <Container title="Bug Melden">
            <div>
                <h1 className={styles.thankYouMsg}>
                    Bedankt voor het ondersteunen van ons platform door fouten aan ons door te geven
                </h1>
            </div>
            <div className={styles.inputFieldTitle}>
                <input
                    className={`${styles.inputBox} ${titleError ? styles.inputBoxError : ""}`}
                    type="text"
                    placeholder="Titel"
                    value={titleValue}
                    onChange={(t) => setTitleValue(t.target.value)}
                />
            </div>
            <div className={styles.inputFieldDesc}>
                <input
                    className={`${styles.inputBox} ${inputError ? styles.inputBoxError : ""}`}
                    type="text"
                    placeholder="Beschrijf hier aan wat er mis ging..."
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
