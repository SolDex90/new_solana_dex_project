import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa'; // Import the bell icon from react-icons
import '../styles/styles.css'; // Import the consolidated styles

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const [notifications] = useState([
    { id: 1, message: 'Order executed at $50' },
    { id: 2, message: 'Price reached $55' },
  ]);

  return (
    <div className="notifications-widget">
      <button className="bell-icon" onClick={toggleNotifications}>
        <FaBell />
        {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
      </button>
      {isOpen && (
        <div className="notifications-list">
          <h4>Notifications</h4>
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id}>{notification.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
