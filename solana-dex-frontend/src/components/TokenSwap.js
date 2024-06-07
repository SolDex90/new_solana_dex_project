import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TokenSwap = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    console.log('TokenSwap component mounted'); // Log when component mounts

    const fetchTokens = async () => {
      try {
        console.log('Fetching tokens...'); // Log when fetch starts
        const response = await axios.get('http://localhost:3000/api/tokens'); // Ensure correct URL
        console.log('Fetched tokens:', response.data); // Log fetched tokens
        setTokens(response.data);
      } catch (error) {
        console.error('Error fetching tokens:', error); // Log any errors
      }
    };

    fetchTokens();
  }, []);

  useEffect(() => {
    console.log('Tokens state updated:', tokens); // Log state updates
  }, [tokens]);

  const handleSwap = async () => {
    // Implement token swap logic here
    setStatusMessage(`Swapped ${amount} ${fromToken} to ${toToken}`);
  };

  return (
    <div>
      <h2>Token Swap</h2>
      <div>
        <label>From:</label>
        <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
          <option value="">Select token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>To:</label>
        <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
          <option value="">Select token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={handleSwap}>Swap</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default TokenSwap;
