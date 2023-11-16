"use client";
import { useState } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";

const Page = () => {
    const [buttonText] = useState("Opslaan");

    const userData = {
        name: "John Doe",
        age: 30,
        email: "johndoe@example.com",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        points: 100,
    };

    return (
        <Container title="Profiel">
            <div className={styles.parentContainer}>
                <div className={styles.circularProfilePhotoContainer}>
                    <img
                        src="https://randomuser.me/api/portraits/men/88.jpg"
                        alt="Profile"
                        className={styles.circularProfilePhoto}
                    />
                </div>
                <div className={styles.userInfo}>
                    <div>
                        <label>Naam:</label>
                        <p>{userData.name}</p>
                    </div>
                    <div>
                        <label>Leeftijd:</label>
                        <p>{userData.age}</p>
                    </div>
                    <div>
                        <label>Email:</label>
                        <p>{userData.email}</p>
                    </div>
                    <div>
                        <label>Bio:</label>
                        <p>{userData.bio}</p>
                    </div>
                    <div>
                        <label>Punten:</label>
                        <p>{userData.points}</p>
                    </div>
                    <button className={styles.saveButton}>{buttonText}</button>
                </div>
            </div>
        </Container>
    );
};

export default Page;