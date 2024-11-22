import React, { useState } from 'react';

const UserSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveSettings = () => {
    // Save user settings logic here
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <h2>User Settings</h2>
      <div>
        <label>
          Email Notifications
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
        </label>
      </div>
      <div>
        <label>
          Dark Mode
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </label>
      </div>
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default UserSettings;
