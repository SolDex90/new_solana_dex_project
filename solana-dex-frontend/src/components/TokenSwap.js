import React, { useState } from 'react';

const TokenSwap = () => {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSwap = async () => {
    // Implement token swap logic here
    setStatusMessage(`Swapped ${amount} ${fromToken} to ${toToken}`);
  };

  return (
    <div>
      <h2>Token Swap</h2>
      <input
        type="text"
        placeholder="From Token"
        value={fromToken}
        onChange={(e) => setFromToken(e.target.value)}
      />
      <input
        type="text"
        placeholder="To Token"
        value={toToken}
        onChange={(e) => setToToken(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSwap}>Swap</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default TokenSwap;
