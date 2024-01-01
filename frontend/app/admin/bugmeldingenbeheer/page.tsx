"use client";
import styles from "./page.module.css";
import Container from "@/app/components/Container";
import { useState, useEffect } from "react";

interface BugReport {
    id: number;
    date: Date;
    title: string;
    description: string;
}

const Page = () => {
    const [bugReports, setBugReports] = useState<BugReport[]>([]);

    const showAllBugReports = async () => {
        try {
            await fetchBugReports();
        }
        catch (error) {
            console.error("Error sending data:", error);
        }


    };

    const fetchBugReports = async () => {
        try {
            const response = await fetch(`api/bug?id=${0}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch bug report data");
            const data = await response.json();
            console.log("data: ");
            console.log(data);
            await setBugReports(data.formattedBugs);

        } catch (error) {
            console.error("Error fetching bug report data:", error);
        }
    };

    useEffect(() => {
        showAllBugReports();
    }, []);

    return (
        <Container title="Bug meldingen beheer">
            <div className={styles.bugReportsContainer}>
                {bugReports.map((bug) => (
                    <div key={bug.id}>
                        <h3>{bug.title}</h3>
                        <p>{bug.description}</p>
                        {/* Add more fields as needed */}
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default Page;
