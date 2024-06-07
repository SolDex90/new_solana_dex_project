import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/token-swap.css'; // Adjusted path to the CSS file

const TokenSwap = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tokens');
        setTokens(response.data);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
  }, []);

  const handleSwap = async () => {
    // Implement token swap logic here
    setStatusMessage(`Swapped ${amount} ${fromToken} to ${toToken}`);
  };

  return (
    <div className="token-swap-container">
      <div className="token-swap">
        <h3>Token Swap</h3>
        <div className="token-swap-section">
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
        <div className="token-swap-section">
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
        <div className="token-swap-section">
          <label>Amount:</label>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button onClick={handleSwap}>Swap</button>
        <p className="status-message">{statusMessage}</p>
      </div>
    </div>
  );
};

export default TokenSwap;
