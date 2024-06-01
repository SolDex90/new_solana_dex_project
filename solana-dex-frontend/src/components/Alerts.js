import React, { useState } from 'react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [token, setToken] = useState('');
  const [price, setPrice] = useState('');

  const handleAddAlert = () => {
    setAlerts([...alerts, { token, price }]);
    setToken('');
    setPrice('');
  };

  return (
    <div>
      <h2>Price Alerts</h2>
      <input
        type="text"
        placeholder="Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleAddAlert}>Add Alert</button>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>
            {alert.token} at ${alert.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
