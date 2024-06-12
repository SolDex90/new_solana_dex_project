import React, { useState, useEffect } from 'react';

const PaperTrading = () => {
  const [portfolios, setPortfolios] = useState({});
  const [balances, setBalances] = useState({});
  const [activePortfolio, setActivePortfolio] = useState('Default');
  const [tradingHistory, setTradingHistory] = useState({});
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [newPortfolioName, setNewPortfolioName] = useState('');

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
    setEditBalance(savedBalances[savedActivePortfolio] || 10000);
  }, []);

  useEffect(() => {
    // Save portfolios, balances, trading history, and active portfolio to local storage
    localStorage.setItem('paperTradingPortfolios', JSON.stringify(portfolios));
    localStorage.setItem('paperTradingBalances', JSON.stringify(balances));
    localStorage.setItem('paperTradingHistory', JSON.stringify(tradingHistory));
    localStorage.setItem('activePortfolio', activePortfolio);
  }, [portfolios, balances, tradingHistory, activePortfolio]);

  const handleBuy = () => {
    const totalCost = price * amount;
    if (totalCost > balances[activePortfolio]) {
      setStatusMessage('Insufficient balance to complete the trade.');
      return;
    }

    const updatedPortfolio = [...portfolios[activePortfolio]];
    const existingAsset = updatedPortfolio.find(asset => asset.symbol === symbol);

    if (existingAsset) {
      existingAsset.amount += parseFloat(amount);
      existingAsset.totalValue += totalCost;
    } else {
      updatedPortfolio.push({ symbol, amount: parseFloat(amount), totalValue: totalCost });
    }

    setPortfolios({ ...portfolios, [activePortfolio]: updatedPortfolio });
    setBalances({ ...balances, [activePortfolio]: balances[activePortfolio] - totalCost });
    setTradingHistory({ ...tradingHistory, [activePortfolio]: [...tradingHistory[activePortfolio], { type: 'buy', symbol, price, amount, date: new Date() }] });
    setStatusMessage(`Bought ${amount} of ${symbol} at ${price} per unit.`);
  };

  const handleSell = () => {
    const existingAsset = portfolios[activePortfolio].find(asset => asset.symbol === symbol);

    if (!existingAsset || existingAsset.amount < amount) {
      setStatusMessage('Insufficient assets to complete the trade.');
      return;
    }

    const totalValue = price * amount;
    const updatedPortfolio = portfolios[activePortfolio].map(asset =>
      asset.symbol === symbol
        ? { ...asset, amount: asset.amount - parseFloat(amount), totalValue: asset.totalValue - totalValue }
        : asset
    ).filter(asset => asset.amount > 0);

    setPortfolios({ ...portfolios, [activePortfolio]: updatedPortfolio });
    setBalances({ ...balances, [activePortfolio]: balances[activePortfolio] + totalValue });
    setTradingHistory({ ...tradingHistory, [activePortfolio]: [...tradingHistory[activePortfolio], { type: 'sell', symbol, price, amount, date: new Date() }] });
    setStatusMessage(`Sold ${amount} of ${symbol} at ${price} per unit.`);
  };

  const handleBalanceUpdate = () => {
    setBalances({ ...balances, [activePortfolio]: editBalance });
    setStatusMessage(`Balance updated to ${editBalance}`);
  };

  const handlePortfolioChange = (e) => {
    const selectedPortfolio = e.target.value;
    setActivePortfolio(selectedPortfolio);
    setEditBalance(balances[selectedPortfolio] || 10000);
  };

  const handleCreatePortfolio = () => {
    if (!newPortfolioName.trim()) {
      setStatusMessage('Portfolio name cannot be empty.');
      return;
    }

    setPortfolios({ ...portfolios, [newPortfolioName]: [] });
    setBalances({ ...balances, [newPortfolioName]: 10000 });
    setTradingHistory({ ...tradingHistory, [newPortfolioName]: [] });
    setActivePortfolio(newPortfolioName);
    setEditBalance(10000);
    setNewPortfolioName('');
    setStatusMessage(`Created new portfolio: ${newPortfolioName}`);
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
        <input
          type="text"
          value={newPortfolioName}
          onChange={(e) => setNewPortfolioName(e.target.value)}
          placeholder="New portfolio name"
        />
        <button onClick={handleCreatePortfolio}>Create Portfolio</button>
      </div>
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
        <input
          type="number"
          value={editBalance}
          onChange={(e) => setEditBalance(parseFloat(e.target.value))}
          placeholder="Enter new balance"
        />
        <button onClick={handleBalanceUpdate}>Update Balance</button>
      </div>
      <div>
        <h3>Trade</h3>
        <input
          type="text"
          placeholder="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <button onClick={handleBuy}>Buy</button>
        <button onClick={handleSell}>Sell</button>
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
