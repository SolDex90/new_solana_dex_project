import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/token-swap.css';

const TokenSwap = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

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

  const handleSwap = () => {
    const fromTokenData = tokens.find(token => token.symbol === fromToken);
    const toTokenData = tokens.find(token => token.symbol === toToken);
    if (fromTokenData && toTokenData) {
      setToAmount((fromAmount * fromTokenData.price / toTokenData.price).toFixed(2));
    }
  };

  const handleSelectToken = (token, type) => {
    if (type === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  return (
    <div className="token-swap-container">
      <div className="token-swap">
        <h3>Token Swap</h3>
        <div className="token-swap-inputs">
          <div className="token-swap-input">
            <label>From:</label>
            <div className="input-group">
              <div className="dropdown-container">
                <div className="dropdown-selected" onClick={() => setShowFromDropdown(!showFromDropdown)}>
                  {fromToken || 'Select Token'}
                </div>
                {showFromDropdown && (
                  <div className="dropdown-menu">
                    {tokens.map((token) => (
                      <div key={token.address} className="dropdown-item" onClick={() => handleSelectToken(token.symbol, 'from')}>
                        {token.symbol}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="Amount"
                className="amount-input"
              />
            </div>
          </div>
          <div className="token-swap-input">
            <label>To:</label>
            <div className="input-group">
              <div className="dropdown-container">
                <div className="dropdown-selected" onClick={() => setShowToDropdown(!showToDropdown)}>
                  {toToken || 'Select Token'}
                </div>
                {showToDropdown && (
                  <div className="dropdown-menu">
                    {tokens.map((token) => (
                      <div key={token.address} className="dropdown-item" onClick={() => handleSelectToken(token.symbol, 'to')}>
                        {token.symbol}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="number"
                value={toAmount}
                readOnly
                placeholder="Amount"
                className="amount-input"
              />
            </div>
          </div>
        </div>
        <button onClick={handleSwap}>Swap</button>
      </div>
    </div>
  );
};

export default TokenSwap;
