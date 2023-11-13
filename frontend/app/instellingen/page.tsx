"use client";
import { useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Container from "../components/Container";
import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  background: var(--bg300);
  border-bottom: 2px solid var(--g500);
`;

const Tab = styled.button`
  flex-grow: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover,
  &.active {
    background: var(--g200);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const SettingsContent = styled.div`
  padding: 20px;
  animation: ${fadeIn} 0.5s;
`;

const Page = () => {
  const [activeTab, setActiveTab] = useState("Account");

  const renderContent = () => {
    switch (activeTab) {
      case "Account":
        return <AccountSettings />;
      case "Notifications":
        return <NotificationSettings />;
      // Add cases for other tabs
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <Container title="Instellingen">
      <Tabs>
        <Tab
          onClick={() => setActiveTab("Account")}
          className={activeTab === "Account" ? "active" : ""}
        >
          Account
        </Tab>
        <Tab
          onClick={() => setActiveTab("Notifications")}
          className={activeTab === "Notifications" ? "active" : ""}
        >
          Notifications
        </Tab>
        {/* Add other tabs here */}
      </Tabs>
      <SettingsContent>{renderContent()}</SettingsContent>
    </Container>
  );
};

export default Page;
