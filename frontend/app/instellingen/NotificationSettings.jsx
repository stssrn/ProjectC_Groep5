"use client";
import React from "react";
import { useState } from "react";
import { SettingOption, Switch } from "../components/SettingsComponents";

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(
    localStorage.getItem("emailNotifications") === "true"
  );
  const [pushNotifications, setPushNotifications] = useState(
    localStorage.getItem("pushNotifications") === "true"
  );

  const toggleEmailNotifications = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    localStorage.setItem("emailNotifications", newValue);
  };

  const togglePushNotifications = () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    localStorage.setItem("pushNotifications", newValue);
  };

  return (
    <div>
      <SettingOption>
        <span>Email Notifications</span>
        <Switch>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={toggleEmailNotifications}
          />
          <span className="slider"></span>
        </Switch>
      </SettingOption>
      <SettingOption>
        <span>Push Notifications</span>
        <Switch>
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={togglePushNotifications}
          />
          <span className="slider"></span>
        </Switch>
      </SettingOption>
      {/* Add more notification settings options here */}
    </div>
  );
};

export default NotificationSettings;
