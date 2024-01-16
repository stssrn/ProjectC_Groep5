"use client";
import React from "react";
import styles from "./page.module.css";
import Container from "../components/Container";
import Link from "next/link";

const ContactInfoPage = () => {
  return (
    <Container title="Contact informatie">
      <h1 className={styles.title}>Contact gegevens</h1>
      <div className={styles.infoCard}>
        <h2>Adres:</h2>
        <p>Albrandswaardsedijk 74, Poortugaal, Nederland, 3172 AA</p>
        <h2>Email:</h2>
        <p>contact@example.com</p>
        <h2>Telefoonnummer:</h2>
        <p>088 358 50 50</p>
        <h2>Openingstijden</h2>
        <p>Werkdagen: 08:30 - 17:00 uur</p>
      </div>

      <div className={styles.bugMelden}>
        <Link href="/bugmelden">
          <span className={styles.bugButton}>Bug melden</span>
        </Link>
      </div>
    </Container>
  );
};

export default ContactInfoPage;
