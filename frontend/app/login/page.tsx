
"use client";
import Image from "next/image";
import styles from "./page.module.css";
import image from "./image.svg";
import { useId } from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  id: number;
  age: number;
  email: string;
  bio: string;
  points: number;
  profilePhoto: string;
  firstName: string;
  lastName: string;
  username: string;
  registrationDate: string;
  firstLogin: boolean;
};

const Page = () => {
  const defaultData: UserData = {
    id: 0,
    age: 30,
    email: "johndoe@example.com",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    points: 100,
    profilePhoto: "https://randomuser.me/api/portraits/men/88.jpg",
    firstName: "",
    lastName: "",
    username: "",
    registrationDate: "",
    firstLogin: true

  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const checkboxId = useId();

  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState<UserData>(defaultData);
  const router = useRouter();

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user?id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUserData({ ...userData, ...data });
      if (data.firstLogin) {
        setShowPopup(true);
      }
      else {
        console.log("Name is: " + data.firstName + " And is it your first time? " + data.firstLogin);
        handleNo();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const saveFirstLogin = async (firstlogin: boolean) => {
    try {
      const response = await fetch("/api/popup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userData.id,
          firstLogin: firstlogin,
        }),
      });


      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };


  const handleYes = async () => {
    router.push("/tour");
    setShowPopup(false);
    saveFirstLogin(false);

  };

  const handleNo = () => {
    router.push("/dashboard");
    setShowPopup(false);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.userId); // Opslaan in local storage zodat we de gebruiker kunnen identificeren bij het ophalen van data.

        //check for firstlogin
        await fetchUserData(data.userId);

      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Server error");
    }
  };




  return (
    <main className={styles.loginContainer}>
      <div className={styles.left}>
        <h1 className={styles.loginTitle}>Inloggen</h1>
        <div className={styles.form}>
          <input
            className={styles.textbox}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={styles.textbox}
            placeholder="Wachtwoord"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.checkboxWrapper}>
            <label className={styles.label} htmlFor={checkboxId}>
              Blijf ingelogd
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              id={checkboxId}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Link
            className={styles.forgotPassword}
            href="/login/wachtwoord-vergeten"
          >
            Wachtwoord vergeten?
          </Link>
          <button className={styles.loginButton} onClick={handleLogin}>
            Inloggen
          </button>
        </div>
      </div>
      <div className={styles.right}>
        <Image className={styles.image} src={image} alt="Login Image" />
      </div>
      {showPopup && (
        <div className={styles.popupContainer}>
          <div className={styles.popup}>
            <p>We zien dat dit de eerste keer is dat je inlogd. Wil je een tour van de applicatie?</p>
            <button onClick={handleYes}>Breng me naar de tour</button>
            <button onClick={handleNo}>Overslaan</button>
          </div>
        </div>
      )}
    </main>
  );

};

export default Page;
