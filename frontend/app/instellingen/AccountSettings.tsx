"use client";
import React, { useState } from "react";
import styles from "./AccountSettings.module.css";
import componentStyles from "../components/SettingsComponents.module.css";

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
      <div className={componentStyles.settingOption}>
        <span>Email</span>
        <input type="email" value={email} onChange={handleEmailChange} />
        <button className={styles.styledButton} onClick={handleEmailSave}>
          Save Email
        </button>
      </div>
      <div className={componentStyles.settingOption}>
        <span>Enable Two-Factor Authentication</span>
        <label className={componentStyles.switchLabel}>
          <input
            className={componentStyles.switchInput}
            type="checkbox"
            checked={isTwoFactorEnabled}
            onChange={toggleTwoFactor}
          />
          <span className={componentStyles.slider}></span>
        </label>
      </div>
      {/* Additional settings options */}
    </div>
  );
};

export default AccountSettings;
