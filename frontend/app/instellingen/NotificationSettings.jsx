// NotificationSettings.jsx
"use client";
import React from "react";
import { SettingOption, Switch } from "./page";

const NotificationSettings = () => {
  return (
    <div>
      <SettingOption>
        <span>Email Notifications</span>
        <Switch>
          <input type="checkbox" />
          <span className="slider"></span>
        </Switch>
      </SettingOption>
      <SettingOption>
        <span>Push Notifications</span>
        <Switch>
          <input type="checkbox" />
          <span className="slider"></span>
        </Switch>
      </SettingOption>
      {/* Add more notification settings options here */}
    </div>
  );
};

export default NotificationSettings;
