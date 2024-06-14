import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/sniping.css'; // Ensure the path is correct

const TokenSniperBot = () => {
  const [newTokens, setNewTokens] = useState([]);
  const [snipeStatus, setSnipeStatus] = useState('');
  const [showFilterWidget, setShowFilterWidget] = useState(false);
  const [minLiquidity, setMinLiquidity] = useState('');
  const [minVolume, setMinVolume] = useState('');
  const [minHolders, setMinHolders] = useState('');
  const [minMarketCap, setMinMarketCap] = useState('');
  const [takeProfitPercentage, setTakeProfitPercentage] = useState('');
  const [profitMultiplier, setProfitMultiplier] = useState('');
  const [snipeBudget, setSnipeBudget] = useState('');
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [pooledFunds, setPooledFunds] = useState(0);
  const [snipeType, setSnipeType] = useState('individual'); // New state for snipe type

  useEffect(() => {
    const fetchNewTokens = async () => {
      try {
        const response = await axios.get('https://api.birdeye.so/new-tokens'); // Replace with the actual BirdEye API endpoint
        setNewTokens(response.data);
      } catch (error) {
        console.error('Error fetching new tokens:', error);
      }
    };

    // Fetch new tokens every 10 seconds
    const interval = setInterval(fetchNewTokens, 10000);
    fetchNewTokens(); // Initial fetch

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const handleSnipe = async (token) => {
    setSnipeStatus(`Sniping ${token.name}...`);
    try {
      // Implement the sniping logic here
      // For example, interacting with a smart contract to buy the token

      // Simulate a sniping success after 2 seconds
      setTimeout(() => {
        setSnipeStatus(`Successfully sniped ${token.name}!`);
        setTransactionHistory([...transactionHistory, { ...token, date: new Date() }]);
        if (snipeType === 'pool') {
          setPooledFunds(prev => prev + parseFloat(snipeBudget));
        }
      }, 2000);
    } catch (error) {
      console.error('Error sniping token:', error);
      setSnipeStatus(`Failed to snipe ${token.name}.`);
    }
  };

  return (
    <div className="sniping-page">
      <div className="sniping-container">
        <h2>New Token Sniping</h2>
        <div className="budget-container">
          <label htmlFor="budget">Set Sniping Budget:</label>
          <input
            id="budget"
            type="number"
            value={snipeBudget}
            onChange={(e) => setSnipeBudget(e.target.value)}
            placeholder="Enter budget"
          />
        </div>
        <div className="filter-toggle" onClick={() => setShowFilterWidget(!showFilterWidget)}>
          <span role="img" aria-label="settings">⚙️</span> Filters
        </div>
        {showFilterWidget && (
          <div className="filter-widget">
            <h3>Filter Tokens</h3>
            <div className="filter-item">
              <label htmlFor="minLiquidity">Minimum Liquidity:</label>
              <input
                id="minLiquidity"
                type="number"
                value={minLiquidity}
                onChange={(e) => setMinLiquidity(e.target.value)}
                placeholder="Enter minimum liquidity"
              />
            </div>
            <div className="filter-item">
              <label htmlFor="minVolume">Minimum Volume:</label>
              <input
                id="minVolume"
                type="number"
                value={minVolume}
                onChange={(e) => setMinVolume(e.target.value)}
                placeholder="Enter minimum volume"
              />
            </div>
            <div className="filter-item">
              <label htmlFor="minHolders">Minimum Holders:</label>
              <input
                id="minHolders"
                type="number"
                value={minHolders}
                onChange={(e) => setMinHolders(e.target.value)}
                placeholder="Enter minimum holders"
              />
            </div>
            <div className="filter-item">
              <label htmlFor="minMarketCap">Minimum Market Cap:</label>
              <input
                id="minMarketCap"
                type="number"
                value={minMarketCap}
                onChange={(e) => setMinMarketCap(e.target.value)}
                placeholder="Enter minimum market cap"
              />
            </div>
            <div className="filter-item">
              <label>Take Profit Percentage:</label>
              <select value={takeProfitPercentage} onChange={(e) => setTakeProfitPercentage(e.target.value)}>
                <option value="">Select percentage</option>
                <option value="50%">Take 50% profit</option>
                <option value="100%">Take 100% profit</option>
                <option value="custom">Custom</option>
              </select>
              {takeProfitPercentage === 'custom' && (
                <input
                  type="number"
                  value={takeProfitPercentage}
                  onChange={(e) => setTakeProfitPercentage(e.target.value)}
                  placeholder="Enter custom take profit"
                />
              )}
            </div>
            <div className="filter-item">
              <label>Profit Multiplier:</label>
              <select value={profitMultiplier} onChange={(e) => setProfitMultiplier(e.target.value)}>
                <option value="">Select multiplier</option>
                <option value="2x">2x</option>
                <option value="3x">3x</option>
                <option value="4x">4x</option>
                <option value="custom">Custom</option>
              </select>
              {profitMultiplier === 'custom' && (
                <input
                  type="number"
                  value={profitMultiplier}
                  onChange={(e) => setProfitMultiplier(e.target.value)}
                  placeholder="Enter custom multiplier"
                />
              )}
            </div>
            <div className="filter-item">
              <label>Snipe Type:</label>
              <select value={snipeType} onChange={(e) => setSnipeType(e.target.value)}>
                <option value="individual">Individual Snipe</option>
                <option value="pool">Pool Snipe</option>
              </select>
            </div>
          </div>
        )}
        <p>{snipeStatus}</p>
        <ul className="token-list">
          {newTokens
            .filter(token => token.liquidity >= minLiquidity)
            .filter(token => token.volume >= minVolume)
            .filter(token => token.holders >= minHolders)
            .filter(token => token.marketCap >= minMarketCap)
            .map((token) => (
              <li key={token.id} className="token-item">
                <div className="token-info">
                  <span className="token-name">{token.name}</span>
                  <span className="token-price">Price: ${token.price}</span>
                  <span className="token-liquidity">Liquidity: ${token.liquidity}</span>
                  <span className="token-volume">Volume: ${token.volume}</span>
                  <span className="token-holders">Holders: {token.holders}</span>
                  <span className="token-marketcap">Market Cap: ${token.marketCap}</span>
                </div>
                <div className="snipe-amount-container">
                  <input
                    type="number"
                    placeholder="Amount to Snipe"
                    // Handle amount change logic here
                  />
                  <button onClick={() => handleSnipe(token)} className="snipe-button">
                    Snipe
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className="transaction-history-container">
        <h2>Transaction History</h2>
        <ul className="transaction-list">
          {transactionHistory.map((transaction, index) => (
            <li key={index} className="transaction-item">
              <div>
                <strong>Token:</strong> {transaction.name}
              </div>
              <div>
                <strong>Price:</strong> ${transaction.price}
              </div>
              <div>
                <strong>Liquidity:</strong> ${transaction.liquidity}
              </div>
              <div>
                <strong>Date:</strong> {transaction.date.toString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="pooled-funds-container">
        <h2>Pooled Funds for Sniping</h2>
        <p>Total Pooled Funds: ${pooledFunds.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default TokenSniperBot;
