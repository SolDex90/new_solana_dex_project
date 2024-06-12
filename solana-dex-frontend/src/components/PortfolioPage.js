import React, { useState, useEffect } from 'react';

const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState({});
  const [activePortfolio, setActivePortfolio] = useState('Default');
  const [balances, setBalances] = useState({});

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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>My Portfolio</h2>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Select Portfolio: </label>
        <select value={activePortfolio} onChange={handlePortfolioChange} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}>
          {Object.keys(portfolios).map((portfolioName) => (
            <option key={portfolioName} value={portfolioName}>{portfolioName}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3 style={{ marginBottom: '10px' }}>Portfolio Summary</h3>
        <p>Balance: ${balances[activePortfolio]?.toFixed(2)}</p>
        <p>Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}</p>
      </div>
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3 style={{ marginBottom: '10px' }}>Assets</h3>
        <ul>
          {portfolios[activePortfolio]?.map((asset, index) => (
            <li key={index}>
              {asset.symbol}: {asset.amount} units (Total Value: ${asset.totalValue.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PortfolioPage;
