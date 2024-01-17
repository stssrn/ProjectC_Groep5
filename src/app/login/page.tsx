
"use client";
import Image from "next/image";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import styles from "./page.module.css";
import image from "./image.svg";
import { useId } from "react";
import Link from "next/link";
// import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from 'next-auth/react'
import { useSession } from "next-auth/react";
import { LoginButton } from "../auth";

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

const Page = () => {
  const defaultData: UserData = {
    id: 0,
    email: "johndoe@example.com",
    password: "",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    points: 100,
    profilePhoto: "MALE",
    firstName: "",
    lastName: "",
    username: "",
    registrationDate: "",
    firstLogin: true
  };

  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkboxId = useId();

  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState<UserData>(defaultData);
  const router = useRouter();

  useEffect(() => {
    const handleRedirection = async () => {
      if (session?.user?.id) {
        const userdata = await fetchUserData(session.user.id.toString());
        setUserData(userdata);

        if (userdata.isAdmin) {
          router.push('/admin');
        } else if (userdata.firstLogin) {
          setShowPopup(true);
        } else {
          router.push('/dashboard');
        }
      }
    };

    handleRedirection();
  }, [session, router]);


  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/fetchFromUserId?id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const saveFirstLogin = async (firstlogin: boolean) => {
    try {
      const response = await fetch("api/popup", {
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
      setLoading(true);
      setError("");
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (response && response.error) {
        setError(response.error);
      } else if (session) {
        const userdata = await fetchUserData(session.user.id.toString())
        setUserData(userdata);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin();
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
            onKeyDown={handleKeyDown}
          />
          <input
            className={styles.textbox}
            placeholder="Wachtwoord"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
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
            {loading ? 'Logging in...' : 'Login'}
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
            <button className={styles.tourButton} onClick={handleYes}>Naar de tour</button>
            <button className={styles.closeButton} onClick={handleNo}>Overslaan</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
