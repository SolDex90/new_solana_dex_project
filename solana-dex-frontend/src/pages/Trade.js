import React, { useState } from 'react';
import Search from '../components/Search';
import TradingHistory from '../components/TradingHistory';
import Swap from '../components/Swap';
import '../styles/styles.css'; // Ensure the path is correct

const Trade = () => {
  const [tokens] = useState([
    { name: 'Token 1', symbol: 'TK1' },
    { name: 'Token 2', symbol: 'TK2' },
  ]);
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [orderType, setOrderType] = useState('market');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('swap');

  const handleSearch = (query) => {
    setFilteredTokens(tokens.filter(token =>
      token.name.toLowerCase().includes(query.toLowerCase()) ||
      token.symbol.toLowerCase().includes(query.toLowerCase())
    ));
  };

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
  };

  const handleOrderSubmit = () => {
    console.log(`Order Type: ${orderType}, Price: ${price}, Amount: ${amount}`);
  };

  const handleComponentChange = (e) => {
    setSelectedComponent(e.target.value);
  };

  return (
    <main className="trade-page">
      <h2>Trade Page</h2>
      <Search onSearch={handleSearch} />
      <ul>
        {filteredTokens.map(token => (
          <li key={token.symbol}>{token.name} ({token.symbol})</li>
        ))}
      </ul>
      <div>
        <h3>Place Order</h3>
        <label>
          Order Type:
          <select value={orderType} onChange={handleOrderTypeChange}>
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
            <option value="stop-loss">Stop-Loss Order</option>
          </select>
        </label>
        {orderType !== 'market' && (
          <label>
            Price:
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
        )}
        <label>
          Amount:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <button onClick={handleOrderSubmit}>Submit Order</button>
      </div>

      <div>
        <label>
          Select Component:
          <select value={selectedComponent} onChange={handleComponentChange}>
            <option value="swap">Swap</option>
            <option value="limit-order">Limit Order</option>
            <option value="stop-loss">Stop-Loss</option>
          </select>
        </label>
      </div>

      {selectedComponent === 'swap' && <Swap />}
      {selectedComponent === 'limit-order' && (
        <div className="limit-order">
          <h3>Limit Order</h3>
          <p>Limit Order Component</p>
        </div>
      )}
      {selectedComponent === 'stop-loss' && (
        <div className="stop-loss">
          <h3>Stop-Loss</h3>
          <p>Stop-Loss Component</p>
        </div>
      )}

      <TradingHistory />
    </main>
  );
};

export default Trade;
