import React, { useState } from "react";
import { SettingOption, Switch } from "../components/SettingsComponents";

const AccountSettings = () => {
  const [email, setEmail] = useState(
    localStorage.getItem("email") || "user@example.com"
  );
  const [isTwoFactorEnabled, setTwoFactorEnabled] = useState(
    localStorage.getItem("twoFactorEnabled") === "true"
  );

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailSave = () => {
    localStorage.setItem("email", email);
  };

  const toggleTwoFactor = () => {
    const newValue = !isTwoFactorEnabled;
    setTwoFactorEnabled(newValue);
    localStorage.setItem("twoFactorEnabled", newValue);
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
