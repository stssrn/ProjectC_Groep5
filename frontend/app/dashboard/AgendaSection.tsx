"use client";
import styles from "./AgendaSection.module.css";
import Container from "../components/Container";
//import agendaData from "@/lib/agenda";
import { useState, useEffect } from "react";
import { clsx } from "clsx";

interface AgendaEvent {
    id: number,
    date: Date,
    name: string,
    description: string,
}
interface MonthData {
    [key: string]: AgendaEvent[]; // Assuming each month has an array of AgendaData
}
const Page: React.FC<{
    className?: string;
}> = ({ className }) => {

    const defaultData: MonthData = {
        januari: [],
        februari: [],
        maart: [],
        april: [],
        mei: [],
        juni: [],
        juli: [],
        augustus: [],
        september: [],
        oktober: [],
        november: [],
        december: [],
    };

    const [agendaData, setAgendaData] = useState<MonthData>(defaultData);


    const fetchAgendaData = async () => {
        try {
            const eventId = 0;
            const response = await fetch(`api/event?id=${eventId}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch agenda data");

            const fetchedData = await response.json();
            const organizedData: MonthData = {
                januari: [],
                februari: [],
                maart: [],
                april: [],
                mei: [],
                juni: [],
                juli: [],
                augustus: [],
                september: [],
                oktober: [],
                november: [],
                december: [],
            };

            fetchedData.events.forEach((event: AgendaEvent) => {
                event.date = new Date(event.date);

                const eventMonth = event.date.getMonth();
                const monthName = getMonthName(eventMonth + 1);

                if (organizedData.hasOwnProperty(monthName)) {
                    organizedData[monthName].push(event);
                }
            });

            setAgendaData({ ...agendaData, ...organizedData });
        } catch (error) {
            console.error("Error fetching agenda data:", error);
        }
    };

    const getMonthName = (monthNumber: number) => {
        const monthNames = [
            "januari",
            "februari",
            "maart",
            "april",
            "mei",
            "juni",
            "juli",
            "augustus",
            "september",
            "oktober",
            "november",
            "december",
        ];

        return monthNames[monthNumber - 1];
    };

    const today = new Date();
    const upcomingEvents = Object.entries(agendaData)
        .flatMap(([month, events]) => events.map((e) => ({ month, ...e })))
        .filter((x) => x.date.getMonth() === today.getMonth())
        .slice(0, 2)

    upcomingEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
    const month = upcomingEvents.at(0)?.month;

    useEffect(() => {
        fetchAgendaData();
    }, []);



    return (
        <section className={className}>
            <Container padding={12} title="Agenda">
                <div className={styles.agenda}>
                    {upcomingEvents.length ? (
                        <>
                            <h2 className={styles.month}>{month}</h2>
                            <div className={styles.wrapper}>
                                <div className={clsx(styles.bar, month && styles[month])}></div>
                                <div className={styles.events}>
                                    {upcomingEvents.map(({ date, name }, i) => (
                                        <div key={i} className={styles.info}>
                                            <p className={styles.day}>{date.getDate()}</p>
                                            <p className={styles.name}>{name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className={styles.noEvents}>
                            Er zijn geen agenda-items deze maand.
                        </p>
                    )}
                </div>
            </Container>
        </section>
    );
}

/*const AgendaBlock: React.FC<{
    className?: string;
}> = ({ className }) => {
    return (
        <section className={className}>
            <Container padding={12} title="Agenda">
                <div className={styles.agenda}>
                    {upcomingEvents.length ? (
                        <>
                            <h2 className={styles.month}>{month}</h2>
                            <div className={styles.wrapper}>
                                <div className={clsx(styles.bar, month && styles[month])}></div>
                                <div className={styles.events}>
                                    {upcomingEvents.map(({ date, name }, i) => (
                                        <div key={i} className={styles.info}>
                                            <p className={styles.day}>{date.getDate()}</p>
                                            <p className={styles.name}>{name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className={styles.noEvents}>
                            Er zijn geen agenda-items deze maand.
                        </p>
                    )}
                </div>
            </Container>
        </section>
    );
};
*/
export default Page;
