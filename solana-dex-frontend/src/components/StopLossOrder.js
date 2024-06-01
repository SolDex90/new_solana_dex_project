import React, { useState } from 'react';

const StopLossOrder = () => {
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleStopLossOrder = () => {
    // Implement stop-loss order logic here
    setStatusMessage(`Placed stop-loss order for ${amount} at ${price}`);
  };

  return (
    <div>
      <h2>Stop-Loss Order</h2>
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
      <button onClick={handleStopLossOrder}>Place Stop-Loss Order</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default StopLossOrder;
