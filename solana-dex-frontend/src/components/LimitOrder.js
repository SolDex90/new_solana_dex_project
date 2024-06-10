import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import TradingViewChart from './TradingViewChart';
import '../styles/limit-order.css';
import { fetchChartData } from '../fetchChartData';

const LimitOrder = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [prices, setPrices] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tokens');
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

        setPrices({
          [fromToken]: pricesData[fromToken].price,
          [toToken]: pricesData[toToken].price,
        });
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
        const data = await fetchChartData(toToken);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setOrderStatus('Failed to fetch chart data');
      }
    };

    loadChartData();
  }, [toToken]);

  const handlePlaceOrder = async () => {
    setOrderStatus('Placing order...');
    try {
      await axios.post('http://localhost:3000/api/limit-order', {
        fromToken,
        toToken,
        price,
        amount,
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
      setShowToDropdown(false);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const totalUSDC = (amount && price && prices[toToken])
    ? ((amount * price) / prices[toToken]).toFixed(2)
    : '0.00';

  return (
    <div className="limit-order-page">
      <div className="limit-order-container">
        <h2>Limit Order</h2>
        {orderStatus && <p>{orderStatus}</p>}
        <div className="limit-order-section">
          <h3>You're Selling</h3>
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
          <h3>You're Buying</h3>
          <div className="limit-order-input-group">
            <Dropdown
              tokens={tokens}
              selectedToken={toToken}
              onSelectToken={(token) => handleSelectToken(token, 'to')}
              showDropdown={showToDropdown}
              setShowDropdown={setShowToDropdown}
            />
            <input
              type="number"
              value={totalUSDC}
              readOnly
              className="limit-order-input"
            />
          </div>
        </div>
        <button onClick={handlePlaceOrder} className="limit-order-button">
          Place Limit Order
        </button>
      </div>
      <div className="limit-order-price-chart-container">
        <TradingViewChart data={chartData} />
      </div>
    </div>
  );
};

export default LimitOrder;
