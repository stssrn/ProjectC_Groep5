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
            const response = await fetch(`api/event?id=${0}`, {
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

            fetchedData.formattedEvents.forEach((event: AgendaEvent) => {


                const eventMonth = new Date(event.date).getMonth();
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

    const currentYearEntries = Object.entries(agendaData)
        .filter(([_, events]) => events.length > 0) // Filter out months with no events
        .map(([month, events]) => {
            // Combine month with events
            const eventsWithMonth = events.map(event => ({ ...event, month }));

            // Sort events by date
            const sortedEvents = eventsWithMonth.sort((a, b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });

            return {
                month,
                sortedEvents,
            };
        })
        .filter(({ sortedEvents }) => sortedEvents.length > 0);

    // Flatten the array of sorted events
    const allSortedEvents = currentYearEntries.flatMap(({ sortedEvents }) => sortedEvents);

    // Filter and grab the first two events that are closest to the current date
    const upcomingEvents = allSortedEvents
        .filter(event => new Date(event.date).getTime() >= Date.now())
        .slice(0, 2);
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
                                            <p className={styles.day}>{new Date(date).getUTCDate()}</p>
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


export default Page;
