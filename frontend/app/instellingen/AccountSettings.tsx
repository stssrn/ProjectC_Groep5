"use client";
import React, { useState } from "react";
import { SettingOption, Switch } from "../components/SettingsComponents";
import styled from "@emotion/styled";

const StyledButton = styled.button`
  padding: 5px 10px;
  font-size: 16px;
  font-family: Arial, sans-serif;
  background-color: #9b2c50;
  color: white;
  border: 2px solid #9b2c50;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  margin-left: 10px;

  &:hover {
    background-color: #7c203e;
    border-color: #7c203e;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 4px 8px;
    margin-left: 0px;
    margin-top: 10px;
  }
`;

const AccountSettings = () => {
  const [email, setEmail] = useState(
    (typeof window !== "undefined" && localStorage.getItem("email")) ||
      "user@example.com"
  );
  const [isTwoFactorEnabled, setTwoFactorEnabled] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("twoFactorEnabled") === "true"
  );

  const handleEmailChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    if (typeof window !== "undefined") {
      setEmail(event.target.value);
    }
  };

  const handleEmailSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("email", email);
    }
  };

  const toggleTwoFactor = () => {
    const newValue = !isTwoFactorEnabled;
    setTwoFactorEnabled(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem("twoFactorEnabled", newValue.toString());
    }
  };

  return (
    <div>
      <SettingOption>
        <span>Email</span>
        <input type="email" value={email} onChange={handleEmailChange} />
        <StyledButton onClick={handleEmailSave}>
          <span>Save Email</span>
        </StyledButton>
      </SettingOption>
      <SettingOption>
        <span>Enable Two-Factor Authentication</span>
        <Switch>
          <input
            type="checkbox"
            checked={isTwoFactorEnabled}
            onChange={toggleTwoFactor}
          />
          <span className="slider"></span>
        </Switch>
      </SettingOption>
      {/* Additional settings options */}
    </div>
  );
};

export default AccountSettings;
