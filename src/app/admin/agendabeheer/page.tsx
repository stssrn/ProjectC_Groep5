"use client";
import styles from "../../agenda/page.module.css";
import eventStyles from "../../agenda/Event.module.css";
import Container from "../../components/Container";
import Event from "./event";
import clsx from "clsx";
import { useState, useEffect, useId } from "react";
import { monthNames } from "@/lib/agenda";
import DateTimePicker from 'react-datetime-picker';
import { Tillana } from "next/font/google";


type EventData = {
    id: number;
    date: Date;
    name: string;
    description: string;
};

interface AgendaEvent {
    id: number,
    date: Date,
    name: string,
    description: string,
}
interface MonthData {
    [key: string]: AgendaEvent[]; // Assuming each month has an array of AgendaData
}

const Page = () => {
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

    const defaultEvent: EventData = {
        id: 0,
        date: new Date(),
        name: "",
        description: ""
    };

    const dialogTitle = useId();
    const dialogDate = useId();
    const dialogDescription = useId();
    const [agendaData, setAgendaData] = useState<MonthData>(defaultData);
    const [isLoading, setIsLoading] = useState(true);
    const [createEvent, setCreateEvent] = useState(false);
    const [newEvent, setNewEvent] = useState<EventData>(defaultEvent);
    const [titleIsEmpty, setTitleIsEmpty] = useState(true);
    const [descIsEmpty, setDescIsEmpty] = useState(true);



    const addEventHandler = async (date: Date, name: string, description: string) => {
        await addEvent(date, name, description);
        newEvent.id = 0;
        newEvent.date = new Date();
        newEvent.name = "";
        newEvent.description = "";
        setDescIsEmpty(true);
        setTitleIsEmpty(true);
        await fetchEventData();
        window.location.reload();
    }

    const addEvent = async (date: Date, title: string, desc: string) => {
        try {
            const response = await fetch(`/api/event`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date,
                    name: title,
                    description: desc,
                }),
            });
            setCreateEvent(false);
            if (!response.ok) {
                throw new Error("Failed to add event data");
            }
        } catch (error) {
            console.error("Error adding event data:", error);
        }
    }

    const fetchEventData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`../api/event?id=${0}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch agenda data");

            const fetchedData = await response.json();
            //console.log("fetched data:")
            //console.log(fetchedData);

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
    useEffect(() => {
        fetchEventData();
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div>Laden...</div>;
    }
    // the month a new year starts, and works in case there are no events in
    // January. Assumes there are no events planned more than a year in advance.
    const currentYear = new Date().getFullYear();
    const nextYear = new Date().getFullYear() + 1;
    const currentYearEntries = Object.entries(agendaData)
        .filter(([_, events]) => events.length)
        .map(([month, events]) => {
            const currentYear = new Date().getFullYear();

            // Filter events that occur in the current year and are in the future
            const currentYearEvents = events.filter(event => {
                const eventDate = new Date(event.date);

                // Check if the event is in the current year and has not passed
                return eventDate.getFullYear() === currentYear &&
                    eventDate.getTime() >= Date.now();
            });

            // Sort the events by month, day, and time
            const sortedEvents = currentYearEvents.sort((a, b) => {
                // Sort by month
                const monthDiff = new Date(a.date).getMonth() - new Date(b.date).getMonth();
                if (monthDiff !== 0) {
                    return monthDiff;
                }

                // If months are the same, sort by day and time
                return new Date(a.date).getDate() - new Date(b.date).getDate() || new Date(a.date).getTime() - new Date(b.date).getTime();
            });

            return {
                month,
                sortedEvents,
            };
        }).filter(({ sortedEvents }) => sortedEvents.length > 0);

    const newYearEntries = Object.entries(agendaData)
        .filter(([_, events]) => events.length)
        .map(([month, events]) => {
            const nextYear = new Date().getFullYear() + 1;
            // Filter events that occur in the next year
            const nextYearEvents = events.filter(event => new Date(event.date).getFullYear() === nextYear);

            // Sort the events by month, day, and time
            const sortedEvents = nextYearEvents.sort((a, b) => {
                // Sort by month
                const monthDiff = new Date(a.date).getMonth() - new Date(b.date).getMonth();
                if (monthDiff !== 0) {
                    return monthDiff;
                }

                // If months are the same, sort by day and time
                return new Date(a.date).getDate() - new Date(b.date).getDate() || new Date(a.date).getTime() - new Date(b.date).getTime();
            });

            return {
                month,
                sortedEvents,
            };
        }).filter(({ sortedEvents }) => sortedEvents.length > 0);
    const combinedEntries = [currentYearEntries, newYearEntries];
    const newYearMonth = newYearEntries
        .map(({ month, sortedEvents }) => ({
            month,
            firstEventDate: sortedEvents
                .reduce((minDate, event) => (
                    new Date(event.date) < minDate ? new Date(event.date) : minDate
                ), new Date(nextYear, 0, 1)),
        }))
        .filter(monthData => monthData.firstEventDate)
        .sort((a, b) => a.firstEventDate.getTime() - b.firstEventDate.getTime())
        .find(monthData => monthData.firstEventDate.getUTCFullYear() >= currentYear);

    const newYearMonthIndex = monthNames.indexOf((newYearMonth as { month: string })?.month);

    const eventElements =
        combinedEntries
            .flat()
            .map(({ month, sortedEvents }) => (
                <div key={month} className={clsx(styles.month, styles[month])}>
                    {newYearMonthIndex !== -1 && monthNames.indexOf(month) === newYearMonthIndex && (
                        <h1>{Number(currentYear) + 1}</h1>
                    )}
                    <h2 className={styles.monthName}>{month}</h2>
                    <div className={styles.eventsWrapper}>
                        <div className={clsx(styles.bar, styles[month])}></div>
                        <div className={styles.events}>
                            {sortedEvents.map((e) => (
                                <Event key={new Date(e.date).getTime()} event={e} />
                            ))}
                        </div>
                    </div>
                </div>
            ));

    return (
        <Container title="Agenda beheer">
            <div className={styles.addDiv}>
                <button
                    className={styles.add}
                    onClick={() => setCreateEvent(true)}
                >
                    <i className="symbol">add</i>
                </button>
            </div>
            <div className={styles.months}>{eventElements}</div>

            {createEvent && (
                <div className={eventStyles.createPopUp}>
                    <div className={eventStyles.dialog}>
                        <div className={eventStyles.content}>
                            <label htmlFor={dialogTitle}>Titel</label>
                            <input
                                type="text"
                                name="Titel"
                                value={newEvent.name}
                                id={dialogTitle}
                                className={titleIsEmpty === false ? eventStyles.textBox : eventStyles.errorBorder}
                                onChange={(e) => {
                                    setNewEvent({ ...newEvent, name: e.target.value });
                                }}
                            />

                            <label htmlFor={dialogDescription}>Beschrijving</label>
                            <textarea
                                name="Beschrijving"
                                value={newEvent.description}
                                id={dialogDescription}
                                rows={5}
                                cols={50}
                                className={descIsEmpty === false ? eventStyles.textBox : eventStyles.errorBorder}
                                onChange={(e) => {
                                    setNewEvent({ ...newEvent, description: e.target.value });
                                }}
                            />

                            <label htmlFor={dialogDate}>Datum</label><br />
                            <div className={styles.dateDiv}>
                                <DateTimePicker
                                    className={eventStyles.dateBox}
                                    onChange={(e: Date | null) => {
                                        // Ensure a default value when e is null
                                        const selectedDate = e || new Date();
                                        setNewEvent({ ...newEvent, date: selectedDate });
                                    }}
                                    value={newEvent.date || null}
                                    locale="en-GB"
                                    calendarIcon={null}
                                    clearIcon={null}
                                    disableCalendar={true}
                                    disableClock={true}
                                    required={true}
                                />
                            </div>

                        </div>
                        <div className={eventStyles.adminDialogButtons}>
                            <input
                                type="button"
                                value="Sluiten"
                                className={eventStyles.adminSecondaryButton}
                                onClick={() => {
                                    setCreateEvent(false);
                                    setDescIsEmpty(false);
                                    setTitleIsEmpty(false);
                                }}
                            />
                            <input
                                type="button"
                                value="Opslaan"
                                className={eventStyles.adminButton}
                                onClick={() => {
                                    if (newEvent.name) setTitleIsEmpty(false);
                                    else setTitleIsEmpty(true);
                                    if (newEvent.description) {
                                        setDescIsEmpty(false);
                                    } else setDescIsEmpty(true);
                                    if (newEvent.name && newEvent.description) addEventHandler(newEvent.date, newEvent.name, newEvent.description);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default Page; //
