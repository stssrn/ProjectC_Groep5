"use client";
import { useState, useEffect, useId } from "react";
import styles from "../../agenda/Event.module.css";
import { useSession } from "next-auth/react";
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';


type EventData = {
    id: number;
    date: Date;
    name: string;
    description: string;
};


const EventComponent: React.FC<{ event: EventData }> = ({ event }) => {


    const dialogTitle = useId();
    const dialogDate = useId();
    const dialogDescription = useId();
    const { data: session } = useSession();
    const [showEdit, setShowEdit] = useState(false);
    const [signedIn, setSignIn] = useState(false);
    const [userId, setUserId] = useState(0);
    const [titleIsEmpty, setTitleIsEmpty] = useState(false);
    const [descIsEmpty, setDescIsEmpty] = useState(false);
    const [dateIsEmpty, setDateIsEmpty] = useState(false);


    const [eventData, setEventData] = useState<EventData>({
        id: 0,
        date: new Date(),
        name: "",
        description: ""
    });

    const handleSignUp = async () => {
        if (signedIn) {
            await saveSignOut(userId, event.id);
            setSignIn(false);

        }
        else {
            await saveSignIn(userId, event.id);
            setSignIn(true);

        }
    };

    const fetchEventData = async (eventId: number, userID: number) => {
        try {
            const response = await fetch(`../api/event?id=${0}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch agenda data");
            const data = await response.json();
            //console.log("data: ");
            //console.log(data);
            await fetchAgendaUserData(userID, eventId);
            setUserId(userID);
            setEventData({ ...eventData, ...data });

        } catch (error) {
            console.error("Error fetching agenda data:", error);
        }
    };

    const fetchAgendaUserData = async (userID: number, eventId: number) => {
        try {
            const response = await fetch(`../api/agendaUser?userId=${userID}&eventId=${eventId}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch agenda user data");
            const data = await response.json();
            if (data.entry !== null) await setSignIn(true);
            else await setSignIn(false);
        } catch (error) {
            console.error("Error fetching agenda user data:", error);
        }
    };

    const saveSignIn = async (userID: number, eventId: number) => {
        try {
            //console.log("save sign in");
            const response = await fetch("../api/agendaUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId: eventId,
                    userId: Number(userID)
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add event and/or user data");
            }
        } catch (error) {
            console.error("Error updating event and/or user data:", error);
        }
    }
    const saveSignOut = async (userID: number, eventId: number) => {
        try {
            //console.log("save sign out");
            const response = await fetch("api/agendaUser", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId: eventId,
                    userId: Number(userID)
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete event and/or user data");
            }
        } catch (error) {
            console.error("Error deleting event and/or user data:", error);
        }
    }

    const saveEditedData = async (title: string, desc: string, date: Date) => {
        try {
            const response = await fetch(`../api/event`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: Number(event.id),
                    date,
                    title,
                    description: desc

                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update educatie_modules data");
            }
        } catch (error) {
            console.error("Error updating educatie_modules data:", error);
        }
    };

    const saveAndClose = async () => {
        if (!event) return;

        // Validate the date
        if (!isValidDate(event.date)) {
            setDateIsEmpty(true);
            return; // Stop execution if the date is invalid
        } else {
            setDateIsEmpty(false);
        }

        await saveEditedData(event.name || '', event.description || '', event.date || Date.now());
        setShowEdit(false);
        const router = useRouter();
        router.push('/admin/agendabeheer');
    };

    const isValidDate = (date: Date) => {
        return !isNaN(date.getTime()); // Check if the date is a valid JavaScript Date object
    };



    useEffect(() => {
        const eventId = event.id;
        if (session?.user?.id) {
            fetchEventData(eventId, session?.user.id);
        }
    }, [event.id, session]);



    return (
        <main>
            <div key={new Date(event.date).getMilliseconds()} className={styles.event}>
                <div className={styles.info}>
                    <time dateTime={new Date(event.date).toISOString()} className={styles.eventDay}>
                        {new Date(event.date).getDate()}
                    </time>
                    <div className={styles.eventName}>{event.name}</div>

                </div>
                <button
                    className={styles.edit}
                    onClick={() => {
                        setShowEdit(true);
                    }}
                >
                    <i className="symbol">edit</i>
                </button>
            </div>

            {showEdit && (
                <div className={styles.createPopUp}>
                    <div className={styles.dialog}>
                        <div className={styles.content}>
                            <label htmlFor={dialogTitle}>Titel</label>
                            <input
                                type="text"
                                name="Titel"
                                value={event.name || ""}
                                id={dialogTitle}
                                className={titleIsEmpty === false ? styles.textBox : styles.errorBorder}
                                onChange={(e) => (event.name = e.target.value)}
                            />
                            <label htmlFor={dialogDate}>Datum</label>
                            <input
                                type="text"
                                name="Datum"
                                value={new Date(event.date).toLocaleDateString('nl-NL', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                }) || ""}
                                id={dialogTitle}
                                className={dateIsEmpty === false ? styles.textBox : styles.errorBorder}
                                onChange={(e) => (event.date = new Date(e.target.value))}
                            />
                            <label htmlFor={dialogDescription}>Beschrijving</label>
                            <textarea
                                name="Beschrijving"
                                value={event.description || ""}
                                id={dialogTitle}
                                rows={5}
                                cols={50}
                                className={descIsEmpty === false ? styles.textBox : styles.errorBorder}
                                onChange={(e) => (event.description = e.target.value)}
                            />

                        </div>
                        <div>
                            <input
                                type="button"
                                value="Opslaan"
                                className={styles.button}
                                onClick={() => {
                                    if (event.name) setTitleIsEmpty(false);
                                    else setTitleIsEmpty(true);
                                    if (event.description) {
                                        setDescIsEmpty(false);
                                        saveAndClose();
                                    }
                                    else setDescIsEmpty(true);

                                }}
                            />
                            <input
                                type="button"
                                value="Verwijderen"
                                className={styles.button}
                                onClick={() => {

                                }}
                            />
                            <input
                                type="button"
                                value="Sluiten"
                                className={styles.secondaryButton}
                                onClick={() => {
                                    setShowEdit(false);
                                    setDescIsEmpty(false);
                                    setTitleIsEmpty(false);
                                    setDateIsEmpty(false);
                                }} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
};

export default EventComponent;
