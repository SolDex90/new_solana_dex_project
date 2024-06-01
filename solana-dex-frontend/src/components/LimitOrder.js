import React, { useState } from 'react';

const LimitOrder = () => {
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleLimitOrder = () => {
    // Implement limit order logic here
    setStatusMessage(`Placed limit order for ${amount} at ${price}`);
  };

  return (
    <div>
      <h2>Limit Order</h2>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleLimitOrder}>Place Limit Order</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default LimitOrder;
