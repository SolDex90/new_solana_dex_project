import React, { useState, useEffect } from 'react';

const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState({});
  const [activePortfolio, setActivePortfolio] = useState('Default');
  const [balances, setBalances] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // Load saved portfolios, balances, and active portfolio from local storage
    const savedPortfolios = JSON.parse(localStorage.getItem('paperTradingPortfolios')) || { Default: [] };
    const savedBalances = JSON.parse(localStorage.getItem('paperTradingBalances')) || { Default: 10000 };
    const savedActivePortfolio = localStorage.getItem('activePortfolio') || 'Default';

    setPortfolios(savedPortfolios);
    setBalances(savedBalances);
    setActivePortfolio(savedActivePortfolio);
  }, []);

  const handlePortfolioChange = (e) => {
    const selectedPortfolio = e.target.value;
    setActivePortfolio(selectedPortfolio);
  };

  const totalPortfolioValue = portfolios[activePortfolio]?.reduce((total, asset) => total + asset.totalValue, 0) || 0;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Portfolio</h2>
      <div style={{ marginBottom: '20px' }}>
        <label>Select Portfolio: </label>
        <select value={activePortfolio} onChange={handlePortfolioChange}>
          {Object.keys(portfolios).map((portfolioName) => (
            <option key={portfolioName} value={portfolioName}>{portfolioName}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Portfolio Summary</h3>
        <p>Balance: ${balances[activePortfolio]?.toFixed(2)}</p>
        <p>Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}</p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Assets</h3>
        <ul>
          {portfolios[activePortfolio]?.map((asset, index) => (
            <li key={index}>
              {asset.symbol}: {asset.amount} units (Total Value: ${asset.totalValue.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>
      <p>{statusMessage}</p>
    </div>
  );
};

export default PortfolioPage;
