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

interface AgendaUser {
    id: number,
    EventId: number,
    userId: number,
}


const EventComponent: React.FC<{ event: EventData }> = ({ event }) => {


    const dialogTitle = useId();
    const dialogDate = useId();
    const dialogDescription = useId();
    const { data: session } = useSession();
    const [showEdit, setShowEdit] = useState(false);
    const [titleIsEmpty, setTitleIsEmpty] = useState(false);
    const [descIsEmpty, setDescIsEmpty] = useState(false);
    const [dateIsEmpty, setDateIsEmpty] = useState(false);
    const [agendaUserByEvent, setAgendaUserByEvent] = useState<AgendaUser[]>([]);

    const [eventName, setEventName] = useState<string>(event.name || "");
    const [eventDate, setEventDate] = useState<Date>(new Date(event.date)); // Use new Date()
    const [eventDescription, setEventDescription] = useState<string>(event.description || "");


    const [eventData, setEventData] = useState<EventData>({
        id: 0,
        date: new Date(),
        name: "",
        description: ""
    });

    const deleteEvent = async (eventId: any) => {
        try {
            const response = await fetch(`/api/event?id=${eventId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed delete to event data");
            }
        } catch (error) {
            console.error("Error deleting event data:", error);
        }
    }

    const fetchAgendaUserByEventId = async (eventID: any) => {
        try {
            const response = await fetch(`/api/event`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId: eventID,
                    userId: 0
                }),
            });
            if (!response.ok) {
                throw new Error("Failed fetch to agendaUser data");
            }
            const data = await response.json();
            setAgendaUserByEvent(data.entries);
        } catch (error) {
            console.error("Error fetching agendaUser data:", error);
        }
    }


    const fetchEventData = async (eventId: number, userID: number) => {
        try {
            const response = await fetch(`../api/event?id=${0}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch agenda data");
            const data = await response.json();
            setEventData({ ...eventData, ...data });

        } catch (error) {
            console.error("Error fetching agenda data:", error);
        }
    };


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

    const isValidDate = (date: Date) => {
        return date instanceof Date && !isNaN(date.getTime());
    };

    const saveAndClose = async () => {
        console.log(eventName, eventDescription)
        if (!eventName || !eventDescription) {
            setTitleIsEmpty(!eventName);
            setDescIsEmpty(!eventDescription);
            return;
        }
        console.log(event.date)
        if (!isValidDate(event.date)) {
            setDateIsEmpty(true);
            return;
        } else {
            setDateIsEmpty(false);
        }

        await saveEditedData(eventName, eventDescription, event.date);
        setShowEdit(false);
        const router = useRouter();
        router.push('/admin/agendabeheer');
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
                        setEventName(event.name || "");
                        setEventDate(event.date || new Date());
                        setEventDescription(event.description || "");
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
                                value={eventName}
                                id={dialogTitle}
                                className={titleIsEmpty === false ? styles.textBox : styles.errorBorder}
                                onChange={(e) => setEventName(e.target.value)}
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
                                    timeZone: 'UTC',
                                })}
                                id={dialogDate}
                                className={dateIsEmpty === false ? styles.textBox : styles.errorBorder}
                                onChange={(e) => setEventDate(new Date(e.target.value))}
                            />



                            <label htmlFor={dialogDescription}>Beschrijving</label>
                            <textarea
                                name="Beschrijving"
                                value={eventDescription}
                                id={dialogDescription}
                                rows={5}
                                cols={50}
                                className={descIsEmpty === false ? styles.textBox : styles.errorBorder}
                                onChange={(e) => setEventDescription(e.target.value)}
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
