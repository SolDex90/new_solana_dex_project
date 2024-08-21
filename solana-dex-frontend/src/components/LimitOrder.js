import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import TradingViewChart from './TradingViewChart';
import '../styles/limit-order.css';
import { Connection, VersionedTransaction, Keypair } from '@solana/web3.js';
import bs58 from 'bs58'; // If using a local wallet
import { fetchChartData } from '../fetchChartData'; // Adjust the import path if necessary

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

  // Fetch tokens
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tokens`);
        setTokens(response.data);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setOrderStatus('Failed to fetch tokens');
      }
    };
    fetchTokens();
  }, []);

  // Fetch prices whenever fromToken, toToken, or price changes
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(`https://price.jup.ag/v6/price?ids=${fromToken},${toToken}`);
        const pricesData = response.data?.data;

        console.log('API response:', pricesData); // Debugging to see the structure of the response

        if (pricesData) {
          const fromTokenPrice = pricesData[fromToken]?.price;
          const toTokenPrice = toToken === 'USDC' ? 1 : pricesData[toToken]?.price; // Set USDC price to $1 if not available

          if (fromTokenPrice && toTokenPrice) {
            setPrices({
              [fromToken]: fromTokenPrice,
              [toToken]: toTokenPrice,
            });

            if (!price) {
              setPrice(fromTokenPrice);
            }
          } else {
            if (!fromTokenPrice) {
              console.error(`Price data for ${fromToken} is missing.`);
            }
            if (!toTokenPrice) {
              console.error(`Price data for ${toToken} is missing.`);
            }
            setOrderStatus('Failed to fetch prices. Some data is missing.');
          }
        } else {
          console.error('Invalid API response format:', pricesData);
          setOrderStatus('Failed to fetch prices. Invalid API response.');
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
        setOrderStatus('Failed to fetch prices');
      }
    };
    fetchPrices();
  }, [fromToken, toToken, price]);

  // Load chart data whenever toToken changes
  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await fetchChartData(toToken, '1d'); // Fetch daily chart data as a default
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setOrderStatus('Failed to fetch chart data');
      }
    };
    loadChartData();
  }, [toToken]);

  // Handle placing the order
  const handlePlaceOrder = async () => {
    setOrderStatus('Fetching the best route...');
    try {
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const walletPrivateKey = process.env.REACT_APP_WALLET_PRIVATE_KEY; // Replace with your actual wallet private key
      const wallet = Keypair.fromSecretKey(bs58.decode(walletPrivateKey));

      // Fetch the best swap route from Jupiter
      const quoteResponse = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken}&outputMint=${toToken}&amount=${amount}&slippageBps=50`
      );
      if (!quoteResponse.data || quoteResponse.data.length === 0) {
        setOrderStatus('No available route found.');
        return;
      }

      setOrderStatus('Route found. Preparing transaction...');

      // Prepare the swap transaction
      const transactionResponse = await axios.post('https://quote-api.jup.ag/v6/swap', {
        quoteResponse: quoteResponse.data,
        userPublicKey: wallet.publicKey.toString(),
        orderType: 'limit', // Specify it's a limit order
        price, // Set the desired price for the limit order
      });

      const transaction = VersionedTransaction.deserialize(
        Buffer.from(transactionResponse.data.swapTransaction, 'base64')
      );

      transaction.sign([wallet]);
      const txid = await connection.sendRawTransaction(transaction.serialize());

      await connection.confirmTransaction(txid);
      setOrderStatus(`Limit order placed successfully! Transaction ID: ${txid}`);
    } catch (error) {
      console.error('Error during order placement:', error);
      setOrderStatus('Order placement failed. Please try again.');
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
        <TradingViewChart data={chartData} setSellPrice={setPrice} />
      </div>
    </div>
  );
};

export default LimitOrder;
