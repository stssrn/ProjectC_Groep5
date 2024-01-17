"use client";
// EventComponent.jsx

import React, { useState, useEffect, useId } from "react";
import styles from "../../agenda/Event.module.css";
import { useSession } from "next-auth/react";
import 'react-datetime-picker/dist/DateTimePicker.css';
import DateTimePicker from 'react-datetime-picker';
import UsersComponent from "./UsersComponent";

type EventData = {
    id: number;
    date: Date;
    name: string;
    description: string;
};

type ValuePiece = Date | null;
type Value = ValuePiece;

const EventComponent: React.FC<{ event: EventData }> = ({ event }) => {
    const dialogTitle = useId();
    const dialogDate = useId();
    const dialogDescription = useId();
    const { data: session } = useSession();
    const [showEdit, setShowEdit] = useState(false);
    const [titleIsEmpty, setTitleIsEmpty] = useState(false);
    const [descIsEmpty, setDescIsEmpty] = useState(false);
    const [eventName, setEventName] = useState<string>(event.name || "");
    const [eventDate, setEventDate] = useState<Value>(event.date ? new Date(event.date) : null);
    const [eventDescription, setEventDescription] = useState<string>(event.description || "");
    const [showUsers, setShowUsers] = useState(false);
    const maxCharacterLength = 20;

    const deleteEventHandler = async (eventId: any) => {
        await deleteAgendaUsersByEventId(eventId);
        await deleteEvent(eventId);
        setShowEdit(false);
        fetchEventData();
        window.location.reload();
    }
    const deleteEvent = async (eventId: any) => {
        try {
            const response = await fetch(`/api/event?id=${eventId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete event data");
            }
        } catch (error) {
            console.error("Error deleting event data:", error);
        }
    }
    const deleteAgendaUsersByEventId = async (eventID: any) => {
        try {
            const response = await fetch(`/api/agendaUser`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId: eventID,
                    userId: 0,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to delete event data");
            }
        } catch (error) {
            console.error("Error deleting event data:", error);
        }
    }

    const fetchEventData = async () => {
        try {
            const response = await fetch(`../api/event?id=${event.id}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch agenda data");
            const data = await response.json();
            setEventDate(new Date(data.date));
            setEventDescription(data.description);
            setEventName(data.name);
        } catch (error) {
            console.error("Error fetching agenda data:", error);
        }
    };

    const saveEditedData = async (title: string, desc: string, date: Date | null) => {
        try {
            const response = await fetch(`../api/event`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: event.id,
                    date: date?.toISOString(),
                    name: title,
                    description: desc
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update event data");
            }
        } catch (error) {
            console.error("Error updating event data:", error);
        }
    };

    const saveAndClose = async () => {
        const trimmedTitle = eventName.trim();
        if (!trimmedTitle || !eventDescription) {
            setTitleIsEmpty(!eventName);
            setDescIsEmpty(!eventDescription);
            return;
        }

        if (trimmedTitle.length > maxCharacterLength) {
            console.error('Title exceeds the character limit.');
            return;
        }

        await saveEditedData(trimmedTitle, eventDescription, eventDate);
        setShowEdit(false);
        fetchEventData();
        window.location.reload();
    };

    useEffect(() => {
        if (session?.user?.id) {
            if (showEdit === false) {
                fetchEventData();
            }
        }
    }, [event.id, session]);

    return (
        <main>
            <div key={new Date(event.date).getMilliseconds()} className={styles.event}>
                <div className={styles.info}>
                    <time dateTime={new Date(event.date).toISOString()} className={styles.eventDay}>
                        {new Date(event.date).getUTCDate()}
                    </time>
                    <div className={styles.eventName}>{event.name}</div>
                </div>
                <button
                    className={styles.edit}
                    onClick={() => {
                        setShowEdit(true);
                        setEventName(event.name || "");
                        setEventDate(new Date(event.date));
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

                            <label htmlFor={dialogDate}>Datum</label><br />
                            <DateTimePicker
                                className={styles.dateBox}
                                onChange={setEventDate}
                                value={eventDate}
                                locale="en-GB"
                                calendarIcon={null}
                                clearIcon={null}
                                disableCalendar={true}
                                disableClock={true}
                                required={true}
                            />
                            <button
                                className={styles.group}
                                onClick={() => {
                                    setShowUsers(true);
                                }}
                            >
                                <i className="symbol">group</i>
                                inschrijvingen
                            </button>
                        </div>
                        <div className={styles.adminDialogButtons}>
                            <input
                                type="button"
                                value="Sluiten"
                                className={styles.adminSecondaryButton}
                                onClick={() => {
                                    setShowEdit(false);
                                    setDescIsEmpty(false);
                                    setTitleIsEmpty(false);
                                }}
                            />
                            <input
                                type="button"
                                value="Verwijderen"
                                className={styles.adminButton}
                                onClick={() => deleteEventHandler(event.id)}
                            />
                            <input
                                type="button"
                                value="Opslaan"
                                className={styles.adminButton}
                                onClick={() => {
                                    if (event.name) setTitleIsEmpty(false);
                                    else setTitleIsEmpty(true);
                                    if (event.description) {
                                        setDescIsEmpty(false);
                                        saveAndClose();
                                    } else setDescIsEmpty(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {showUsers && (
                <UsersComponent event={event} setShowUsers={setShowUsers} />
            )}
        </main>
    );
};

export default EventComponent;
