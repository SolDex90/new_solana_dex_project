import React, { useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    // Example notifications
    { id: 1, message: 'Order executed at $50' },
    { id: 2, message: 'Price reached $55' },
  ]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
