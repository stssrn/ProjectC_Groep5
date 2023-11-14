"use client";
import React, { useState } from "react";
import { SettingOption, Switch } from "../components/SettingsComponents";

const AccountSettings = () => {
  const [email, setEmail] = useState(
    (typeof window !== "undefined" && localStorage.getItem("email")) ||
      "user@example.com"
  );
  const [isTwoFactorEnabled, setTwoFactorEnabled] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("twoFactorEnabled") === "true"
  );

  const handleEmailChange = (event) => {
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
      localStorage.setItem("twoFactorEnabled", newValue);
    }
  };

  return (
    <div>
      <SettingOption>
        <span>Email</span>
        <input type="email" value={email} onChange={handleEmailChange} />
        <button onClick={handleEmailSave}>Save Email</button>
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
