"use client";
import React from "react";
import componentStyles from "../components/SettingsComponents.module.css";
import { useState } from "react";

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("emailNotifications") === "true"
  );
  const [pushNotifications, setPushNotifications] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("pushNotifications") === "true"
  );

  const toggleEmailNotifications = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem("emailNotifications", newValue.toString());
    }
  };

  const togglePushNotifications = () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem("pushNotifications", newValue.toString());
    }
  };

  return (
    <div>
      <div className={componentStyles.settingOption}>
        <span>Email Notifications</span>
        <label className={componentStyles.switchLabel}>
          <input
            type="checkbox"
            className={componentStyles.switchInput}
            checked={emailNotifications}
            onChange={toggleEmailNotifications}
          />
          <span className={componentStyles.slider}></span>
        </label>
      </div>
      <div className={componentStyles.settingOption}>
        <span>Push Notifications</span>
        <label className={componentStyles.switchLabel}>
          <input
            type="checkbox"
            className={componentStyles.switchInput}
            checked={pushNotifications}
            onChange={togglePushNotifications}
          />
          <span className={componentStyles.slider}></span>
        </label>
      </div>
      {/* Add more notification settings options here */}
    </div>
  );
};

export default NotificationSettings;