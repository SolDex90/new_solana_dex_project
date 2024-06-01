import React, { useState, useEffect } from 'react';

const PaperTrading = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(10000); // Initial balance for paper trading
  const [tradingHistory, setTradingHistory] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // Load saved portfolio and trading history from local storage
    const savedPortfolio = JSON.parse(localStorage.getItem('paperTradingPortfolio')) || [];
    const savedHistory = JSON.parse(localStorage.getItem('paperTradingHistory')) || [];
    setPortfolio(savedPortfolio);
    setTradingHistory(savedHistory);
  }, []);

  useEffect(() => {
    // Save portfolio and trading history to local storage
    localStorage.setItem('paperTradingPortfolio', JSON.stringify(portfolio));
    localStorage.setItem('paperTradingHistory', JSON.stringify(tradingHistory));
  }, [portfolio, tradingHistory]);

  const handleBuy = () => {
    const totalCost = price * amount;
    if (totalCost > balance) {
      setStatusMessage('Insufficient balance to complete the trade.');
      return;
    }

    const updatedPortfolio = [...portfolio];
    const existingAsset = updatedPortfolio.find(asset => asset.symbol === symbol);

    if (existingAsset) {
      existingAsset.amount += parseFloat(amount);
      existingAsset.totalValue += totalCost;
    } else {
      updatedPortfolio.push({ symbol, amount: parseFloat(amount), totalValue: totalCost });
    }

    setPortfolio(updatedPortfolio);
    setBalance(balance - totalCost);
    setTradingHistory([...tradingHistory, { type: 'buy', symbol, price, amount, date: new Date() }]);
    setStatusMessage(`Bought ${amount} of ${symbol} at ${price} per unit.`);
  };

  const handleSell = () => {
    const existingAsset = portfolio.find(asset => asset.symbol === symbol);

    if (!existingAsset || existingAsset.amount < amount) {
      setStatusMessage('Insufficient assets to complete the trade.');
      return;
    }

    const totalValue = price * amount;
    const updatedPortfolio = portfolio.map(asset =>
      asset.symbol === symbol
        ? { ...asset, amount: asset.amount - parseFloat(amount), totalValue: asset.totalValue - totalValue }
        : asset
    ).filter(asset => asset.amount > 0);

    setPortfolio(updatedPortfolio);
    setBalance(balance + totalValue);
    setTradingHistory([...tradingHistory, { type: 'sell', symbol, price, amount, date: new Date() }]);
    setStatusMessage(`Sold ${amount} of ${symbol} at ${price} per unit.`);
  };

  return (
    <div>
      <h2>Paper Trading</h2>
      <div>
        <h3>Portfolio</h3>
        <ul>
          {portfolio.map((asset, index) => (
            <li key={index}>
              {asset.symbol}: {asset.amount} units (Total Value: ${asset.totalValue.toFixed(2)})
            </li>
          ))}
        </ul>
        <p>Balance: ${balance.toFixed(2)}</p>
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
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleBuy}>Buy</button>
        <button onClick={handleSell}>Sell</button>
      </div>
      <p>{statusMessage}</p>
      <div>
        <h3>Trading History</h3>
        <ul>
          {tradingHistory.map((trade, index) => (
            <li key={index}>
              {trade.date.toString()} - {trade.type.toUpperCase()} {trade.amount} of {trade.symbol} at ${trade.price} per unit
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaperTrading;
