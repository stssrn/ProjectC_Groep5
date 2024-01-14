"use client";
import React, { useState, useEffect, useId } from "react";
import styles from "../../agenda/Event.module.css";

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

type EventData = {
    id: number;
    date: Date;
    name: string;
    description: string;
};

const SignUserIn: React.FC<{ event: EventData; setSignUserIn: React.Dispatch<React.SetStateAction<boolean>> }> = ({ event, setSignUserIn }) => {

    const dialogInfo = useId();
    const dialogSignIn = useId();
    const dialogSignOut = useId();
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [agendaUsersByEvent, setAgendaUsersByEvent] = useState<UserData[]>([]);
    const [allUsersUnfiltered, setAllUsersUnFiltered] = useState<UserData[]>([]);
    const [editUserSignIn, setEditUserSignIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserData>();
    const [isLoading, setIsLoading] = useState(false);
    const [signIn, setSignIn] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('');


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
    }

    const filterData = () => {

        const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
        if (searchInput) {
            const query = searchInput.value.toLowerCase();
            const filteredData = allUsersUnfiltered.filter((user) =>
                user.id?.toString().includes(query) ||
                user.firstName?.toLowerCase().includes(query) ||
                user.lastName?.toLowerCase().includes(query)
            );
            setAllUsers(filteredData);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const users = await fetchAllUsers();
            if (users) {
                setAllUsers(users);
                setAllUsersUnFiltered(users);
            }
            setIsLoading(false);

        };
        fetchData();
    }, [event.id]);

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
                    <div className={styles.filterOptions}>
                        <input
                            className={styles.search}
                            type="search"
                            name=""
                            id="searchInput"
                            placeholder="Bevat…"
                            defaultValue={searchQuery}
                        />
                        <input
                            className={styles.button}
                            type="button"
                            value="Zoek"
                            onClick={filterData}
                        />
                    </div>
                    <div className={styles.content}>
                        <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>Voornaam</th>
                                    <th>Achternaam</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {allUsers.map((user) => (
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
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <div className={styles.adminDialogButtons}>
                        <input
                            type="button"
                            value="Sluiten"
                            className={styles.adminButton}
                            onClick={() => {
                                setSignUserIn(false);
                            }}
                        />
                    </div>
                </div>
            </div>
            {editUserSignIn && (
                <div className={styles.createPopUp}>
                    <div className={styles.dialog}>
                        <div className={styles.content}>
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
                            />
                            <label htmlFor={dialogSignIn} style={{ marginLeft: '8px' }}>Inschrijven</label><br></br>
                            <input
                                type="radio"
                                name="Inschrijven"
                                value="option 2"
                                onChange={() => setSignIn(false)}
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

export default SignUserIn;
