import React, { useState } from "react";
import { SettingOption, Switch } from "../components/SettingsComponents";

const AccountSettings = () => {
  const [email, setEmail] = useState("user@example.com"); // Dummy email
  const [isTwoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!isTwoFactorEnabled);
  };

  return (
    <div>
      <SettingOption>
        <span>Email</span>
        <input type="email" value={email} onChange={handleEmailChange} />
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
