import React, { useState, useEffect } from 'react';

const PaperTrading = () => {
  const [portfolios, setPortfolios] = useState({});
  const [balances, setBalances] = useState({});
  const [activePortfolio, setActivePortfolio] = useState('Default');
  const [tradingHistory, setTradingHistory] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false);
  const [initialBalance, setInitialBalance] = useState(10000);

  useEffect(() => {
    // Load saved portfolios, balances, trading history, and active portfolio from local storage
    const savedPortfolios = JSON.parse(localStorage.getItem('paperTradingPortfolios')) || { Default: [] };
    const savedBalances = JSON.parse(localStorage.getItem('paperTradingBalances')) || { Default: 10000 };
    const savedHistory = JSON.parse(localStorage.getItem('paperTradingHistory')) || { Default: [] };
    const savedActivePortfolio = localStorage.getItem('activePortfolio') || 'Default';

    setPortfolios(savedPortfolios);
    setBalances(savedBalances);
    setTradingHistory(savedHistory);
    setActivePortfolio(savedActivePortfolio);
  }, []);

  useEffect(() => {
    // Save portfolios, balances, trading history, and active portfolio to local storage
    localStorage.setItem('paperTradingPortfolios', JSON.stringify(portfolios));
    localStorage.setItem('paperTradingBalances', JSON.stringify(balances));
    localStorage.setItem('paperTradingHistory', JSON.stringify(tradingHistory));
    localStorage.setItem('activePortfolio', activePortfolio);
  }, [portfolios, balances, tradingHistory, activePortfolio]);

  const handlePortfolioChange = (e) => {
    const selectedPortfolio = e.target.value;
    setActivePortfolio(selectedPortfolio);
    setIsCreatingPortfolio(false); // Disable editing balance after selecting a portfolio
  };

  const handleCreatePortfolio = () => {
    if (!newPortfolioName.trim()) {
      setStatusMessage('Portfolio name cannot be empty.');
      return;
    }

    setPortfolios({ ...portfolios, [newPortfolioName]: [] });
    setBalances({ ...balances, [newPortfolioName]: initialBalance });
    setTradingHistory({ ...tradingHistory, [newPortfolioName]: [] });
    setActivePortfolio(newPortfolioName);
    setInitialBalance(10000);
    setNewPortfolioName('');
    setIsCreatingPortfolio(false);
    setStatusMessage(`Created new portfolio: ${newPortfolioName}`);
  };

  const handleStartCreatingPortfolio = () => {
    setIsCreatingPortfolio(true);
    setNewPortfolioName('');
    setInitialBalance(10000);
  };

  return (
    <div>
      <h2>Paper Trading</h2>
      <div>
        <label>Select Portfolio: </label>
        <select value={activePortfolio} onChange={handlePortfolioChange}>
          {Object.keys(portfolios).map((portfolioName) => (
            <option key={portfolioName} value={portfolioName}>{portfolioName}</option>
          ))}
        </select>
        {!isCreatingPortfolio && (
          <button onClick={handleStartCreatingPortfolio}>Create New Portfolio</button>
        )}
      </div>
      {isCreatingPortfolio && (
        <div>
          <input
            type="text"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            placeholder="New portfolio name"
          />
          <input
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(parseFloat(e.target.value))}
            placeholder="Initial balance"
          />
          <button onClick={handleCreatePortfolio}>Create Portfolio</button>
        </div>
      )}
      <div>
        <h3>Portfolio</h3>
        <ul>
          {portfolios[activePortfolio]?.map((asset, index) => (
            <li key={index}>
              {asset.symbol}: {asset.amount} units (Total Value: ${asset.totalValue.toFixed(2)})
            </li>
          ))}
        </ul>
        <p>Balance: ${balances[activePortfolio]?.toFixed(2)}</p>
      </div>
      <p>{statusMessage}</p>
      <div>
        <h3>Trading History</h3>
        <ul>
          {tradingHistory[activePortfolio]?.map((trade, index) => (
            <li key={index}>
              {new Date(trade.date).toString()} - {trade.type.toUpperCase()} {trade.amount} of {trade.symbol} at ${trade.price} per unit
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaperTrading;
