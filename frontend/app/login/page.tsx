"use client";
import Image from "next/image";
import styles from "./page.module.css";
import image from "./image.svg";
import { useId } from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkboxId = useId();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.userId);
        window.location.href = "/dashboard";
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message);
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
    </main>
  );
};

export default Page;
