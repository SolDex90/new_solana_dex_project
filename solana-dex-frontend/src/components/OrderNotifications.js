import React, { useEffect, useState } from 'react';

const OrderNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock function to simulate fetching notifications
    const fetchNotifications = () => {
      setTimeout(() => {
        setNotifications([
          { id: 1, message: 'Order for 10 BTC executed at $50,000' },
          { id: 2, message: 'Order for 5 ETH executed at $3,000' },
        ]);
      }, 3000);
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Order Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderNotifications;
