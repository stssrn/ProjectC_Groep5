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

export const SettingOption = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px; // Reduced width
  height: 20px; // Reduced height
  margin-left: 10px; // Added margin

  & input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  & .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 20px; // Adjusted for new height
  }

  & .slider:before {
    position: absolute;
    content: "";
    height: 18px; // Slightly smaller than the slider's height
    width: 18px; // Square shape
    left: 1px; // Adjusted for new dimensions
    bottom: 1px; // Adjusted for new dimensions
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    transform: translateX(20px); // Adjusted for new width
  }
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
