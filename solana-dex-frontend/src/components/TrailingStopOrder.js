import React, { useState } from 'react';

const TrailingStopOrder = () => {
  const [amount, setAmount] = useState('');
  const [trailPercentage, setTrailPercentage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleTrailingStopOrder = () => {
    if (!amount || !trailPercentage) {
      setStatusMessage('Please enter a valid amount and trail percentage.');
      return;
    }
    
    if (amount <= 0 || trailPercentage <= 0) {
      setStatusMessage('Amount and trail percentage must be greater than zero.');
      return;
    }

    // Implement trailing stop order logic here
    setStatusMessage(`Placed trailing stop order for ${amount} tokens with a trail of ${trailPercentage}%`);
    setAmount('');
    setTrailPercentage('');
  };

  return (
    <div>
      <h2>Trailing Stop Order</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Trail Percentage"
        value={trailPercentage}
        onChange={(e) => setTrailPercentage(e.target.value)}
      />
      <button onClick={handleTrailingStopOrder}>Place Trailing Stop Order</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default TrailingStopOrder;
