import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import '../styles/limit-order.css';
import { Connection, Keypair, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { getSymbolFromMint, getDecimalOfMint } from '../utils/apiService';
import tokenAmount from '../images/tokenAmount.png'; // Added image

const LimitOrder = () => {
  const wallet = useWallet();
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [prices, setPrices] = useState({});
  const [inputMintToken, setInputMintToken] = useState([]);
  const [outputMintToken, setOutputMintToken] = useState([]);
  const [activeTab, setActiveTab] = useState('openOrders'); 
  const [openOrders, setOpenOrders] = useState([]);
  const [allVerifiedTokens, setAllVerifiedTokens] = useState([]);
  const [iframeSrc, setIframeSrc] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const END_POINT = process.env.RPC_END_POINT || 'https://hidden-patient-slug.solana-mainnet.quiknode.pro/d8cb6d9a7b156d44efaca020f46f9196d20bc926';
  const base = Keypair.generate();

  // Fetch tokens
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tokens`);
        setTokens(response.data);

        const res = await axios.get(`https://tokens.jup.ag/tokens?tags=verified`);
        setAllVerifiedTokens(res.data);

        const fromTokenMint = response.data.find(token => token.symbol === fromToken)?.address;
        const toTokenMint = response.data.find(token => token.symbol === toToken)?.address;

        if (fromTokenMint && toTokenMint) {
          setInputMintToken(fromTokenMint);
          setOutputMintToken(toTokenMint);
          setIframeSrc(`https://birdeye.so/tv-widget/${fromTokenMint}/${toTokenMint}?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=AREA&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark`);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setOrderStatus('Failed to fetch tokens');
      }
    };
    fetchTokens();
  }, [API_BASE_URL, fromToken, toToken]);

  // Fetch open orders
  useEffect(() => {
    const fetchOpenOrders = async (walletAddress) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/limit-order-history`, {
          walletAddress: walletAddress,
        });
        return response.data.fetchResult;
      } catch (error) {
        console.error('Error fetching open orders:', error);
        return [];
      }
    };

    if (wallet.connected && wallet.publicKey) {
      fetchOpenOrders(wallet.publicKey.toString()).then(setOpenOrders);
    }
  }, [wallet.connected, wallet.publicKey, API_BASE_URL]);

  // Fetch prices whenever fromToken, toToken, or price changes
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(`https://price.jup.ag/v6/price?ids=${fromToken},${toToken}`);
        const pricesData = response.data?.data;
        if (pricesData) {
          const fromTokenPrice = pricesData[fromToken]?.price;
          const toTokenPrice = toToken === 'USDC' ? 1 : pricesData[toToken]?.price;

          if (fromTokenPrice && toTokenPrice) {
            setPrices({ [fromToken]: fromTokenPrice, [toToken]: toTokenPrice });
            if (!price) setPrice(fromTokenPrice);
          } else {
            setOrderStatus('Failed to fetch prices. Some data is missing.');
          }
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
        setOrderStatus('Failed to fetch prices');
      }
    };
    fetchPrices();
  }, [fromToken, toToken, price]);

  useEffect(() => {
    setIframeSrc(`https://birdeye.so/tv-widget/${inputMintToken}/${outputMintToken}?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=AREA&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark`);
  }, [inputMintToken, outputMintToken]);

  // Handle placing the order
  const handlePlaceOrder = async () => {
    if (!wallet) {
      setOrderStatus('Please Connect Wallet!');
      return;
    }
    try {
      setOrderStatus('Initiating transaction...');
      const connection = new Connection(END_POINT);
      const walletAddress = wallet.publicKey.toString();
      const sendingBase = base.publicKey.toString();
      
      const res = await axios.post(`${API_BASE_URL}/api/limit-order`, {
        fromToken,
        walletAddress,
        amount,
        totalUSDC,
        price,
        toToken,
        sendingBase,
      });

      setOrderStatus('Sending transaction...');
      const tx = res.data.orderResult.tx;
      const transactionBuf = Buffer.from(tx, 'base64');
      const transaction = Transaction.from(transactionBuf);
      const signedTransaction = await wallet.signTransaction(transaction);
      signedTransaction.partialSign(base);

      const latestBlockhash = await connection.getLatestBlockhash();
      const txid = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: true,
        maxRetries: 2,
      });

      await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txid,
      });

      setOrderStatus(`Transaction succeeded! Transaction ID: ${txid}`);
    } catch (error) {
      console.error('Error during order placement:', error);
      setOrderStatus('Order placement failed. Please try again.');
    }
  };

  // Handle canceling the order
  const handleCancelOrder = async (orderId) => {
    if (!orderId) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/api/cancel-order`, { orderId });
      const tx = response.data.tx;
      const connection = new Connection(END_POINT);
      const transactionBuf = Buffer.from(tx, 'base64');
      const transaction = Transaction.from(transactionBuf);
      const signedTransaction = await wallet.signTransaction(transaction);
      signedTransaction.partialSign(base);

      const latestBlockhash = await connection.getLatestBlockhash();
      const txid = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: true,
        maxRetries: 2,
      });

      await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txid,
      });
      console.log(`Order ${orderId} canceled with txid ${txid}`);
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const handleSelectToken = (token, type) => {
    if (type === 'from') {
      setFromToken(token);
      setShowFromDropdown(false);
      setPrice(''); // Reset price when changing fromToken
      const tokenMint = tokens.find(t => t.symbol === token);
      setInputMintToken(tokenMint.address);
    } else {
      setToToken(token);
      setShowToDropdown(false);
      const tokenMint = tokens.find(t => t.symbol === token);
      setOutputMintToken(tokenMint.address);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleConnectWallet = async () => {
    try {
      if (!wallet.connected) {
        await wallet.connect();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setOrderStatus('Failed to connect wallet. Please try again.');
    }
  };

  const totalUSDC = (amount && price && prices[toToken])
    ? ((amount * price) / prices[toToken]).toFixed(2)
    : '0.00';

  const renderHistoryTable = (orders) => {
    const historyData = orders.orderHistory;
    return historyData.map((history) => (
      <tr key={history.id}>
        <td style={{ display: 'none' }}>{history.orderKey}</td>
        <td>{getSymbolFromMint(history.inputMint, tokens)} ➡️ {getSymbolFromMint(history.outputMint, tokens)}</td>
        <td>{(parseFloat(history.oriInAmount) / Math.pow(10, getDecimalOfMint(history.inputMint, allVerifiedTokens)))} {getSymbolFromMint(history.inputMint, tokens)}</td>
        <td>{(parseFloat(history.oriOutAmount) / Math.pow(10, getDecimalOfMint(history.outputMint, allVerifiedTokens)))} {getSymbolFromMint(history.outputMint, tokens)}</td>
        <td>{history.createdAt}</td>
        <td>{history.state}</td>
      </tr>
    ));
  };

  const renderOpenOrdersTable = (orders) => {
    const openOrderData = orders.openOrders;
    if (!openOrderData) return;
    return openOrderData.map((history) => (
      <tr key={history.id}>
        <td style={{ display: 'none' }}>{history.orderKey}</td>
        <td>
          {parseFloat(history.oriInAmount) / Math.pow(10, getDecimalOfMint(history.inputMint, allVerifiedTokens))}
          {` ${getSymbolFromMint(history.inputMint, tokens)} ➡️ `}
          {parseFloat(history.oriOutAmount) / Math.pow(10, getDecimalOfMint(history.outputMint, allVerifiedTokens))}
          {` ${getSymbolFromMint(history.outputMint, tokens)}`}
        </td>
        <td>{history.expiredAt}</td>
        <td><button onClick={() => handleCancelOrder(history.id)}>Cancel</button></td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="limit-order-page">
        <div className="limit-order-price-chart-container">
          <iframe 
            title='TradingIFrame'
            width="100%" 
            height="600" 
            src={iframeSrc}
            allowFullScreen>
          </iframe>
        </div>
        <div className="limit-order-container">
          {orderStatus && <p>{orderStatus}</p>}
          <div className="limit-order-section">
            <div className="limit-order-section-header">
              <h3>You're Selling</h3>
              <div className="right-section">
                <img src={tokenAmount} alt="Token" />
                <span>{amount === 0 ? 0 : amount} {fromToken}</span>
                </div>
            </div>
            <div className="limit-order-input-group">
              <Dropdown
                tokens={tokens}
                selectedToken={fromToken}
                onSelectToken={(token) => handleSelectToken(token, 'from')}
                showDropdown={showFromDropdown}
                setShowDropdown={setShowFromDropdown}
                style={{ width: '200px' }}
              />
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.0"
                style={{ marginLeft: '10px', width: '100px', padding: '10px' }}
                min={0}
                step={0.1}
              />
            </div>
          </div>

          <div className="limit-order-section">
            <div className="limit-order-section-header">
              <h3>You're Buying</h3>
              <div className="right-section">
                <img src={tokenAmount} alt="Token" />
                <span>{totalUSDC} {toToken}</span>
              </div>
            </div>
            <div className="limit-order-input-group">
              <Dropdown
                tokens={tokens}
                selectedToken={toToken}
                onSelectToken={(token) => handleSelectToken(token, 'to')}
                showDropdown={showToDropdown}
                setShowDropdown={setShowToDropdown}
              />
              <label>${totalUSDC}</label>
            </div>
            <div className="limit-order-limit-price-group">
              <label>Sell {fromToken} at rate</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="limit-order-input"
                style={{ padding: '10px', marginLeft: '0px' }}
              />
            </div>
          </div>

          <button disabled={!wallet.connected} onClick={wallet.connected ? handlePlaceOrder : handleConnectWallet} className="limit-order-button wallet-adapter-button">
            {wallet.connected ? 'Place limit order' : 'Connect wallet'}
          </button>

          <div className="limit-order-section">
            <div className="limit-order-section-header">
              <h3>Limit Order Summary</h3>
            </div>
            <div className="limit-order-input-group">
              <label>Sell Order</label>
              <label>{amount} {fromToken}</label>
            </div>
            <div className="limit-order-input-group">
              <label>To buy</label>
              <label>{totalUSDC} {toToken}</label>
            </div>
            <div className="limit-order-input-group">
              <label>Buy SOL at Rate</label>
              <label>${parseInt(price)}</label>
            </div>
            <div className="limit-order-input-group">
              <label>Expiry</label>
              <label>Never</label>
            </div>
            <div className="limit-order-input-group">
              <label>Platform Fee</label>
              <label>0.10%</label>
            </div>
          </div>
        </div>
      </div>

      <div className='limit-orders-hisory'>
        <div className="tab-container">
          <div className={`tab-item ${activeTab === 'openOrders' ? 'active' : ''}`} onClick={() => setActiveTab('openOrders')}>Open Orders</div>
          <div className={`tab-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</div>
        </div>

        {wallet.connected ? (
          <div className="tab-content">
            {activeTab === 'openOrders' && (
              <div className="order-table">
                <table>
                  <thead>
                    <tr>
                      <th style={{ display: 'none' }}>Order id</th>
                      <th>Order Info</th>
                      <th>Price</th>
                      <th>Expiry</th>
                      <th>Filled Size</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{renderOpenOrdersTable(openOrders)}</tbody>
                </table>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="order-table">
                <table>
                  <thead>
                    <tr>
                      <th style={{ display: 'none' }}>Order ID</th>
                      <th>Pair</th>
                      <th>Sell</th>
                      <th>Buy</th>
                      <th>Date</th>
                      <th>State</th>
                    </tr>
                  </thead>
                  <tbody>{renderHistoryTable(openOrders)}</tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <span>Please connect wallet</span>
        )}
      </div>
    </div>
  );
};

export default LimitOrder;
