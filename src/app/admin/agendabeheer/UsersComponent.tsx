"use client";
import React, { useState, useEffect, useId } from "react";
import styles from "../../agenda/Event.module.css";
import SignUserIn from "./SignUserIn";

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

interface AgendaUser {
    id: number,
    EventId: number,
    userId: number,
}

type EventData = {
    id: number;
    date: Date;
    name: string;
    description: string;
};

const UsersComponent: React.FC<{ event: EventData; setShowUsers: React.Dispatch<React.SetStateAction<boolean>> }> = ({ event, setShowUsers }) => {

    const dialogInfo = useId();
    const dialogSignIn = useId();
    const dialogSignOut = useId();
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [agendaUsersByEvent, setAgendaUsersByEvent] = useState<UserData[]>([]);
    const [editUserSignIn, setEditUserSignIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserData>();
    const [isLoading, setIsLoading] = useState(false);
    const [signIn, setSignIn] = useState(true);
    const [signUserIn, setSignUserIn] = useState(false);


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

        setAllUsers(allusers);
        const filteredUsers = allusers.filter(user => agendaUsers.some(agendaUser => agendaUser.userId === user.id));
        setAgendaUsersByEvent(filteredUsers);
        return allusers;
    }

    const saveSignIn = async () => {
        try {
            const response = await fetch("/api/agendaUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId: event.id,
                    userId: Number(currentUser?.id)
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add event and/or user data");
            }
        } catch (error) {
            console.error("Error updating event and/or user data:", error);
        }
    }

    const saveSignOut = async () => {
        try {
            const response = await fetch("/api/agendaUser", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId: event.id,
                    userId: Number(currentUser?.id)
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete event and/or user data");
            }
        } catch (error) {
            console.error("Error deleting event and/or user data:", error);
        }
    }

    const signInAndSignOutHandler = async () => {
        if (signIn) await saveSignIn();
        else await saveSignOut();
        await filterUsersHandler();

    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const users = await filterUsersHandler();
            if (users) {
                setAllUsers(users);
            }
            setIsLoading(false);

        };
        fetchData();
    }, [event.id, signUserIn]);

    if (isLoading) {
        return (
            <div className={styles.createPopUp}>
                <div className={styles.dialog}>
                    <div className={styles.content}>
                        <div>Laden...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main>
            <div className={styles.createPopUp}>
                <div className={styles.dialog}>
                    <div className={styles.addDiv}>
                        <button
                            className={styles.add}
                            onClick={() => setSignUserIn(true)}
                        >
                            <i className="symbol">add</i>
                        </button>
                    </div><br></br>
                    <div className={styles.contentUsers}>

                        <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>Voornaam</th>
                                    <th>Achternaam</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {agendaUsersByEvent.map((user) =>
                                    <tr key={user.id}>
                                        <td className={styles.tableId}>{user.id}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td></td>
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
                    <div className={styles.adminDialogButtons}>
                        <input
                            type="button"
                            value="Sluiten"
                            className={styles.adminButton}
                            onClick={() => {
                                setShowUsers(false);
                            }}
                        />
                    </div>
                </div>
            </div>
            {signUserIn && (
                <SignUserIn event={event} setSignUserIn={setSignUserIn} />
            )}
            {editUserSignIn && (
                <div className={styles.createPopUp}>
                    <div className={styles.dialog}>
                        <div className={styles.contentSignIn}>
                            <br></br><br></br><label htmlFor={dialogInfo}>Gebruiker</label>
                            <input
                                type="text"
                                name="Info"
                                value={`ID: ${currentUser?.id} - ${currentUser?.firstName} ${currentUser?.lastName} `}
                                id={dialogInfo}
                                className={styles.textBox}
                                readOnly
                            /><br></br>
                            <input
                                type="radio"
                                name="Inschrijven"
                                value="option 1"
                                onChange={() => setSignIn(true)}
                                checked={signIn === true}
                                className={styles.radio}
                            />
                            <label htmlFor={dialogSignIn} style={{ marginLeft: '8px' }}>Inschrijven</label><br></br>
                            <input
                                type="radio"
                                name="Inschrijven"
                                value="option 2"
                                onChange={() => setSignIn(false)}
                                className={styles.radio}
                            /><label htmlFor={dialogSignOut} style={{ marginLeft: '8px' }}>Uitschrijven</label>
                        </div>
                        <div className={styles.adminDialogButtons}>
                            <input
                                type="button"
                                value="Sluiten"
                                className={styles.adminSecondaryButton}
                                onClick={() => {
                                    setEditUserSignIn(false);
                                }}
                            />
                            <input
                                type="button"
                                value="Opslaan"
                                className={styles.adminButton}
                                onClick={() => {
                                    signInAndSignOutHandler();
                                    setEditUserSignIn(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

        </main >
    );
};

export default UsersComponent;
