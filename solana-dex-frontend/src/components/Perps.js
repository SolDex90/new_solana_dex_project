import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import TradingViewChart from './TradingViewChart';
import '../styles/perps.css';
import { fetchChartData } from '../fetchChartData'; // Adjust the import path if necessary
import tokenAmount from '../images/tokenAmount.png';

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
  const [position, setPosition] = useState('long'); // Position state
  const [leverage, setLeverage] = useState(1); // Leverage state

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

        if (pricesData[fromToken]?.price && !price) {
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
        const data = await fetchChartData(fromToken, timeframe);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setOrderStatus('Failed to fetch chart data');
      }
    };

    loadChartData();
  }, [timeframe, fromToken]);

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
    <div className="perps-page">
      <div className="perps-price-chart-container">
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
      <div className="perps-container">
        {orderStatus && <p>{orderStatus}</p>}
        <div className="perps-section">
          <div className="perps-section-header">
            <h3>You're Paying</h3>
            <div className="right-section">
              <img src={tokenAmount} alt="Token" />
              <span>{amount === 0 ? 0 : amount} {fromToken}</span>
            </div>
          </div>
          <div className="perps-input-group">
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
              placeholder="0.0"
              className="perps-input"
            />
          </div>
        </div>
        <div className="perps-section">
          <h3>Size of {position === 'long' ? 'Long' : 'Short'}</h3>
          <div className="perps-input-group right-section">
            <label>USDC: </label>
            <input
              type="number"
              value={sizeOfPosition}
              readOnly
              className="perps-input"
            />
          </div>
        </div>
        <div className="perps-section">
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
        <div className="perps-section">
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
        <button onClick={handlePlaceOrder} className="perps-button">
          Place Perps Order
        </button>
      </div>
    </div>
  );
};

export default PerpsOrder;
