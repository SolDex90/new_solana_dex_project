import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import '../styles/dca.css';
import { Connection, VersionedTransaction, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const DCA = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('minute');
  const [interval, setInterval] = useState(1);
  const [numOrders, setNumOrders] = useState(1);
  const [orderStatus, setOrderStatus] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [solToUsdc, setSolToUsdc] = useState(0);

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

    const fetchSolToUsdcRate = async () => {
      try {
        const response = await axios.get(`https://price.jup.ag/v6/price?ids=${fromToken}`);
        setSolToUsdc(response.data.data[fromToken].price);
      } catch (error) {
        console.error('Error fetching SOL to USDC rate:', error);
      }
    };

    fetchTokens();
    fetchSolToUsdcRate();
  }, [fromToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('DCA strategy submitted:', { fromToken, toToken, amount, frequency, interval, numOrders });

    try {
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const walletPrivateKey = 'YOUR_WALLET_PRIVATE_KEY'; // Replace with your actual wallet private key
      const wallet = Keypair.fromSecretKey(bs58.decode(walletPrivateKey));

      setOrderStatus('Fetching best route...');

      const quoteResponse = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken}&outputMint=${toToken}&amount=${amount}&slippageBps=50`
      );

      if (!quoteResponse.data || quoteResponse.data.length === 0) {
        setOrderStatus('No available route found.');
        return;
      }

      setOrderStatus('Route found. Preparing transaction...');

      for (let i = 0; i < numOrders; i++) {
        const transactionResponse = await axios.post('https://quote-api.jup.ag/v6/swap', {
          quoteResponse: quoteResponse.data,
          userPublicKey: wallet.publicKey.toString(),
        });

        const transaction = VersionedTransaction.deserialize(
          Buffer.from(transactionResponse.data.swapTransaction, 'base64')
        );

        transaction.sign([wallet]);
        const rawTransaction = transaction.serialize();

        setTimeout(async () => {
          try {
            const txid = await connection.sendRawTransaction(rawTransaction);
            await connection.confirmTransaction(txid);
            setOrderStatus(`DCA order ${i + 1} placed successfully! Transaction ID: ${txid}`);
          } catch (error) {
            console.error(`Error during DCA order ${i + 1}:`, error);
            setOrderStatus(`DCA order ${i + 1} failed. Please try again.`);
          }
        }, i * intervalToMs(interval, frequency));
      }
    } catch (error) {
      console.error('Error placing DCA order:', error);
      setOrderStatus('Failed to place DCA order. Please try again.');
    }
  };

  const intervalToMs = (interval, frequency) => {
    switch (frequency) {
      case 'minute':
        return interval * 60 * 1000;
      case 'hour':
        return interval * 60 * 60 * 1000;
      case 'daily':
        return interval * 24 * 60 * 60 * 1000;
      case 'weekly':
        return interval * 7 * 24 * 60 * 60 * 1000;
      case 'monthly':
        return interval * 30 * 24 * 60 * 60 * 1000;
      default:
        return interval * 60 * 1000;
    }
  };

  const handleSelectToken = (token, type) => {
    if (type === 'from') {
      setFromToken(token);
      setShowFromDropdown(false);
    } else {
      setToToken(token);
      setShowToDropdown(false);
    }
  };

  const equivalentUsdc = (amount * solToUsdc).toFixed(2);

  return (
    <div className="card small-card">
      <h2>Dollar Cost Averaging (DCA)</h2>
      {orderStatus && <p>{orderStatus}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="from-token">I want to sell:</label>
          <div className="inline-fields">
            <Dropdown
              tokens={tokens}
              selectedToken={fromToken}
              onSelectToken={(token) => handleSelectToken(token, 'from')}
              showDropdown={showFromDropdown}
              setShowDropdown={setShowFromDropdown}
              style={{ width: '200px' }} // Adjusted width for the ticker bar
            />
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount to Invest"
              required
              style={{ marginLeft: '10px', width: '100px' }}
            />
            <span style={{ marginLeft: '10px', color: '#bbb' }}>
              ≈ ${equivalentUsdc}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="to-token">To buy:</label>
          <Dropdown
            tokens={tokens}
            selectedToken={toToken}
            onSelectToken={(token) => handleSelectToken(token, 'to')}
            showDropdown={showToDropdown}
            setShowDropdown={setShowToDropdown}
            style={{ width: '200px' }} // Adjusted width for the ticker bar
          />
        </div>
        <div className="form-group">
          <label htmlFor="interval">Every</label>
          <div className="inline-fields">
            <input
              type="number"
              id="interval"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              required
              style={{ marginRight: '10px', width: '50px' }}
            />
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
              style={{ width: '100px' }}
            >
              <option value="minute">Minute</option>
              <option value="hour">Hour</option>
              <option value="daily">Day</option>
              <option value="weekly">Week</option>
              <option value="monthly">Month</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="num-orders">Over</label>
          <div className="inline-fields">
            <input
              type="number"
              id="num-orders"
              value={numOrders}
              onChange={(e) => setNumOrders(e.target.value)}
              required
              style={{ marginRight: '10px', width: '50px' }}
            />
            <span>orders</span>
          </div>
        </div>
        <button type="submit">Start DCA</button>
      </form>
    </div>
  );
};

export default DCA;
