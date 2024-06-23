import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import TradingViewChart from './TradingViewChart';
import '../styles/perps.css';
import { fetchChartData } from '../fetchChartData'; // Adjust the import path if necessary

const PerpsOrder = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('15m'); // Default timeframe
  const [position, setPosition] = useState('long'); // Add state for position
  const [leverage, setLeverage] = useState(1); // Add state for leverage

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get('https://api.cryptosion.io/api/tokens');
        setTokens(response.data);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setOrderStatus('Failed to fetch tokens');
      }
    };

    fetchTokens();
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(`https://price.jup.ag/v6/price?ids=${fromToken},${toToken}`);
        const pricesData = response.data.data;

        if (pricesData[fromToken].price && !price) {
          setPrice(pricesData[fromToken].price);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
        setOrderStatus('Failed to fetch prices');
      }
    };

    if (fromToken && toToken) {
      fetchPrices();
    }
  }, [fromToken, toToken, price]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await fetchChartData('SOL', timeframe); // Fetch SOL chart data
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setOrderStatus('Failed to fetch chart data');
      }
    };

    loadChartData();
  }, [timeframe]);

  const handlePlaceOrder = async () => {
    setOrderStatus('Placing order...');
    try {
      await axios.post('https://api.cryptosion.io/api/perps-order', {
        fromToken,
        toToken,
        price,
        amount,
        position,
        leverage,
      });
      setOrderStatus('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderStatus('Failed to place order. Please try again.');
    }
  };

  const handleSelectToken = (token, type) => {
    if (type === 'from') {
      setFromToken(token);
      setShowFromDropdown(false);
      setPrice(''); // Reset price when changing fromToken
    } else {
      setToToken(token);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const sizeOfPosition = (amount && price && leverage)
    ? (amount * price * leverage).toFixed(2)
    : '0.00';

  return (
    <div className="limit-order-page">
      <div className="limit-order-container">
        <h2>Perps Order</h2>
        {orderStatus && <p>{orderStatus}</p>}
        <div className="limit-order-section">
          <h3>You're Paying</h3>
          <div className="limit-order-input-group">
            <Dropdown
              tokens={tokens}
              selectedToken={fromToken}
              onSelectToken={(token) => handleSelectToken(token, 'from')}
              showDropdown={showFromDropdown}
              setShowDropdown={setShowFromDropdown}
            />
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Amount"
              className="limit-order-input"
            />
          </div>
          <div className="limit-order-input-group">
            <label>Sell {fromToken} at </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="limit-order-input"
            />
          </div>
        </div>
        <div className="limit-order-section">
          <h3>Size of {position === 'long' ? 'Long' : 'Short'}</h3>
          <div className="limit-order-input-group">
            <input
              type="number"
              value={sizeOfPosition}
              readOnly
              className="limit-order-input"
            />
          </div>
        </div>
        <div className="limit-order-section">
          <h3>Position</h3>
          <div className="position-toggle">
            <button className={position === 'long' ? 'active' : ''} onClick={() => setPosition('long')}>
              Long
            </button>
            <button className={position === 'short' ? 'active' : ''} onClick={() => setPosition('short')}>
              Short
            </button>
          </div>
        </div>
        <div className="limit-order-section">
          <h3>Leverage</h3>
          <input
            type="range"
            min="1"
            max="100"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            className="leverage-slider"
          />
          <span>{leverage}x</span>
        </div>
        <button onClick={handlePlaceOrder} className="limit-order-button">
          Place Perps Order
        </button>
      </div>
      <div className="limit-order-price-chart-container">
        <div className="timeframe-buttons">
          <button onClick={() => setTimeframe('1m')}>1m</button>
          <button onClick={() => setTimeframe('5m')}>5m</button>
          <button onClick={() => setTimeframe('15m')}>15m</button>
          <button onClick={() => setTimeframe('30m')}>30m</button>
          <button onClick={() => setTimeframe('1h')}>1h</button>
          <button onClick={() => setTimeframe('4h')}>4h</button>
          <button onClick={() => setTimeframe('1d')}>1d</button>
          <button onClick={() => setTimeframe('1w')}>1w</button>
        </div>
        <TradingViewChart data={chartData} setSellPrice={setPrice} />
      </div>
    </div>
  );
};

export default PerpsOrder;
