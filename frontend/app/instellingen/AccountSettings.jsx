import React, { useState } from "react";
import { SettingOption, Switch } from "./page";

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
          <input type="checkbox" checked={isTwoFactorEnabled} onChange={toggleTwoFactor} />
          <span className="slider"></span>
        </Switch>
      </SettingOption>
      {/* Additional settings options */}
    </div>
  );
};

export default AccountSettings;













// // AccountSettings.jsx
// "use client";
// import React from "react";
// import styled from "@emotion/styled";
// import { SettingOption, Switch } from "./page"; // Import these from your main page file

// const AccountSettings = () => {
//   return (
//     <div>
//       <SettingOption>
//         <span>Change Email</span>
//         <input type="email" placeholder="Enter new email" />
//       </SettingOption>
//       <SettingOption>
//         <span>Enable Two-Factor Authentication</span>
//         <Switch>
//           <input type="checkbox" />
//           <span className="slider"></span>
//         </Switch>
//       </SettingOption>
//       {/* Add more account settings options here */}
//     </div>
//   );
// };

// export default AccountSettings;
