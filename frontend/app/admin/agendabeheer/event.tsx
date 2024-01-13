"use client";
import { useState, useEffect, useId } from "react";
import styles from "../../agenda/Event.module.css";
import { useSession } from "next-auth/react";
import 'react-datetime-picker/dist/DateTimePicker.css';
import DateTimePicker from 'react-datetime-picker';

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

type UserData = {
    id: number;
    email: string;
    password: string;
    bio: string;
    points: number;
    profilePhoto: "MALE" | "FEMALE";
    profilePhotoUrl?: string;
    firstName: string;
    lastName: string;
    username: string;
    registrationDate: string;
    firstLogin: boolean;
};

const EventComponent: React.FC<{ event: EventData }> = ({ event }) => {

    const dialogTitle = useId();
    const dialogDate = useId();
    const dialogDescription = useId();
    const { data: session } = useSession();
    const [showEdit, setShowEdit] = useState(false);
    const [titleIsEmpty, setTitleIsEmpty] = useState(false);
    const [descIsEmpty, setDescIsEmpty] = useState(false);
    const [agendaUserByEvent, setAgendaUserByEvent] = useState<AgendaUser[]>([]);
    const [eventName, setEventName] = useState<string>(event.name || "");
    const [eventDate, setEventDate] = useState<Date | null>(event.date ? new Date(event.date) : null);
    const [eventDescription, setEventDescription] = useState<string>(event.description || "");
    const [showUsers, setShowUsers] = useState(false);
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [editUserSignIn, setEditUserSignIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserData>();

    const [eventData, setEventData] = useState<EventData>({
        id: 0,
        date: new Date(),
        name: "",
        description: ""
    });

    const deleteEventHandler = async (eventId: any) => {
        //delete all agenda users with this id maybe with id 0??
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

    }

    const fetchAllUsers = async () => {
        try {
            const response = await fetch(`/api/user/fetchFromUserId?id=${0}`);
            if (!response.ok) throw new Error("Failed to fetch user data");

            const data = await response.json();
            return data.users;
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
    const fetchAgendaUserByEventId = async (userID: any, eventId: any) => {
        try {
            const response = await fetch(`/api/agendaUser?userId=${userID}&eventId=${eventId}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch agenda user data");
            const data = await response.json();
            return data.entries;
        } catch (error) {
            console.error("Error fetching agenda user data:", error);
        }
    }


    const filterUsersHandler = async () => {
        const agendaUsers: AgendaUser[] = await fetchAgendaUserByEventId(0, event.id);
        const allusers: UserData[] = await fetchAllUsers();
        setAgendaUserByEvent(agendaUsers);
        setAllUsers({ ...allUsers, ...allusers });
        const filteredUsers = allusers.filter(user => agendaUsers.some(agendaUser => agendaUser.userId === user.id));
        setFilteredUsers(filteredUsers);
    }

    const fetchEventData = async () => {
        try {
            const response = await fetch(`../api/event?id=${0}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch agenda data");
            const data = await response.json();
            setEventData({ ...eventData, ...data });
            setEventDate(new Date(event.date));

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
                    id: Number(event.id),
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
        if (!eventName || !eventDescription) {
            setTitleIsEmpty(!eventName);
            setDescIsEmpty(!eventDescription);
            return;
        }

        await saveEditedData(eventName, eventDescription, eventDate);
        setShowEdit(false);
        fetchEventData();
        window.location.reload();
    };


    useEffect(() => {
        if (session?.user?.id) {
            fetchEventData();
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
                        setEventDate(event.date ? new Date(event.date) : null);
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
                                onChange={(date: Date | null) => setEventDate(date)}
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
                                    filterUsersHandler();
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
                <div className={styles.createPopUp}>
                    <div className={styles.dialog}>
                        <div className={styles.content}>
                            <button
                                className={styles.exit}
                                onClick={() => {
                                    setShowUsers(false);
                                }}
                            >
                                <i className="symbol">close</i>
                            </button><br></br>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <th>Voornaam</th>
                                        <th>Achternaam</th>
                                        <th></th>
                                    </tr>
                                    {filteredUsers.map((user) =>
                                        <tr key={user.id}>
                                            <td className={styles.tableId}>{user.id}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>
                                                <button
                                                    className={styles.editGroup}
                                                    onClick={() => {
                                                        setCurrentUser(user);
                                                        setEditUserSignIn(true);
                                                    }}
                                                >
                                                    <i className="symbol">edit</i>
                                                </button>
                                            </td>
                                        </tr>

                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            )}
        </main>
    );
};


export default EventComponent;
