import React, { useState } from 'react';

const Staking = () => {
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleStake = () => {
    // Implement staking logic here
    setStatusMessage(`Staked ${amount} tokens`);
  };

  return (
    <div>
      <h2>Staking</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleStake}>Stake Tokens</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default Staking;
