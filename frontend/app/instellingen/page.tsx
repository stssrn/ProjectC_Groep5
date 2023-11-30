"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Container from "../components/Container";
import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";

const Page = () => {
  const [activeTab, setActiveTab] = useState("Account");

  const renderContent = () => {
    switch (activeTab) {
      case "Account":
        return <AccountSettings />;
      case "Notifications":
        return <NotificationSettings />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <Container title="Instellingen">
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("Account")}
          className={
            activeTab === "Account"
              ? `${styles.tab} ${styles.active}`
              : styles.tab
          }
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab("Notifications")}
          className={
            activeTab === "Notifications"
              ? `${styles.tab} ${styles.active}`
              : styles.tab
          }
        >
          Notifications
        </button>
        {/* Add other tabs here */}
      </div>
      <div className={styles.settingsContent}>{renderContent()}</div>
    </Container>
  );
};

export default Page;
