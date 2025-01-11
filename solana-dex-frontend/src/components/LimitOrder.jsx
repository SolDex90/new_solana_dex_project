import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/limit-order.css';
import { VersionedTransaction, Connection ,PublicKey, Keypair } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { getSymbolFromMint, getDecimalOfMint } from '../utils/apiService';
import tokenAmount from '../images/tokenAmount.png';
import TradingViewWidget from './TradingViewWidget';
import TokenSelectModal from './TokenSelectModal';

const LimitOrder = () => {
  const wallet = useWallet();
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [prices, setPrices] = useState({});
  const [inputMintToken, setInputMintToken] = useState([]);
  const [outputMintToken, setOutputMintToken] = useState([]);
  const [activeTab, setActiveTab] = useState('openOrders'); 
  const [openOrders, setOpenOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState({ orders: [] });
  const [allVerifiedTokens, setAllVerifiedTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenSelectModalOpen, setIsTokenSelectModalOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState('from');
  const [fromBalance, setFromBalance] = useState('0');

  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5000';
  const END_POINT = import.meta.env.VITE_APP_RPC_END_POINT || 'https://api.mainnet-beta.solana.com';
  const base = Keypair.generate();

  // Fetch tokens
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tokens`);
        setTokens(response.data);
        const res = await axios.get(`https://tokens.jup.ag/tokens?tags=verified`);
        const fromTokenMint = response.data.find(token => token.symbol === fromToken)?.address;
        const toTokenMint = response.data.find(token => token.symbol === toToken)?.address;
        
        if (fromTokenMint && toTokenMint) {
          setInputMintToken(fromTokenMint);
          setOutputMintToken(toTokenMint);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };
    fetchTokens();
  }, [API_BASE_URL, fromToken, toToken]);

  const fetchTokenBalance = async (tokenAddress, walletAddress) => {
    try {
      const connection = new Connection(END_POINT);
      const publicKey = new PublicKey(walletAddress);

      if (tokenAddress === 'So11111111111111111111111111111111111111112') {
        const balance = await connection.getBalance(publicKey);
        return balance / 1e9; // Convert lamports to SOL
      }

      const tokenPublicKey = new PublicKey(tokenAddress);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      const tokenAccount = tokenAccounts.value.find(account => 
        account.account.data.parsed.info.mint === tokenPublicKey.toBase58()
      );

      return tokenAccount ? tokenAccount.account.data.parsed.info.tokenAmount.uiAmount : 0;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchDefaultTokenBalance = async () => {
      if (wallet.connected && wallet.publicKey) {
        const token = tokens.find(t => t.symbol === fromToken);
        if (token) {
          const balance = await fetchTokenBalance(token.address, wallet.publicKey.toString());
          setFromBalance(balance);
        }
      }
    };

    fetchDefaultTokenBalance();
  }, [wallet.connected, wallet.publicKey, tokens, fromToken]);
  
  // Fetch balance whenever fromToken changes
  useEffect(() => {
    const updateBalance = async () => {
      if (wallet.connected && wallet.publicKey) {
        const token = tokens.find(t => t.symbol === fromToken);
        if (token) {
          const balance = await fetchTokenBalance(token.address, wallet.publicKey.toString());
          setFromBalance(balance);
        }
      }
    };

    updateBalance();
  }, [fromToken, wallet.connected, wallet.publicKey, tokens]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (wallet.connected && wallet.publicKey) {
        setIsLoading(true);
        try {
          const ordersData = await fetchOpenOrders(wallet.publicKey.toString());
          setOpenOrders(ordersData.openOrders);
          setOrderHistory(ordersData.orderHistory);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setOpenOrders([]);
        setOrderHistory({ orders: [] });
      }
    };
  
    fetchOrders();
  }, [wallet.connected, wallet.publicKey]);
  // Fetch prices whenever fromToken, toToken, or price changes
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const token1 = tokens.find(t => t.symbol === fromToken);
        const token2 = tokens.find(t => t.symbol === toToken);
        const tokenIds = [token1? token1.address : null, token2? token2.address : null];

        const jupiterResponse = await axios.get(`https://api.jup.ag/price/v2?ids=${tokenIds.join(',')}`);
        // Extract prices from the response
        const pricesData = {};
        for (const tokenId of tokenIds) {
            const token = tokens.find(t => t.address === tokenId);
            pricesData[token.symbol] = jupiterResponse.data.data[tokenId]?.price || 'Price not available';
        }

        if (pricesData) {
          const fromTokenPrice = pricesData[fromToken];
          const toTokenPrice = toToken === 'USDC' ? 1 : pricesData[toToken]; // Set USDC price to $1 if not available

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
      }
    };
    if(tokens.length > 0) {
      fetchPrices();
    }
  }, [fromToken, toToken, price, tokens]);
 

  // Handle placing the order
  const handlePlaceOrder = async () => {

    if (!wallet) {
      setOrderStatus('Please Connect Wallet!');
      return;
    }
    try {
      setOrderStatus('Initiating transaction...');
      const connection = new Connection(END_POINT);
      const walletAddress = wallet.publicKey;
      const sendingBase = base.publicKey.toString();

      // Send the request to the backend to create the limit order
      const res = await axios.post(`${API_BASE_URL}/api/limit-order`, {
        fromToken,
        walletAddress,
        amount,
        totalUSDC,
        price,
        toToken,
        sendingBase,
        platformFeeBps: 20,
      });

      // Check if the transaction data is valid
      if (!res.data.orderResult || !res.data.orderResult.tx) {
        throw new Error('Invalid transaction data returned from the backend');
      }

      setOrderStatus('Sending transaction...');

      // Deserialize the transaction as a VersionedTransaction
      const tx = res.data.orderResult.tx;
      const transactionBuf = Buffer.from(tx, 'base64');
      const transaction = VersionedTransaction.deserialize(transactionBuf);

      // Sign the transaction with the wallet
      const signedTransaction = await wallet.signTransaction(transaction);

      // Send the signed transaction to the Solana network
      const latestBlockhash = await connection.getLatestBlockhash();
      console.log('LATEST BLOCKHASH:', latestBlockhash);

      const txid = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: true,
        maxRetries: 2,
      });

      // Confirm the transaction
      await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txid,
      });

      setOrderStatus(`Transaction succeeded!`);
      // Fetch and update open orders after placing the order
      const orders = await fetchOpenOrders(wallet.publicKey.toString());
      setOpenOrders(orders);
    } catch (error) {
      console.error('Error during order placement:', error);
      setOrderStatus('Order placement failed. Please try again.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!orderId) return;
  
    try {
      // Send the cancel order request to the Jupiter API
      const response = await axios.post('https://api.jup.ag/limit/v2/cancelOrders', {
        maker: wallet.publicKey.toString(),
        orders: [orderId], // Cancel a specific order
        computeUnitPrice: "auto",
      });
  
      const txs = response.data.txs; // Array of base64-encoded transactions
      const connection = new Connection(END_POINT);
  
      // Sign and send each transaction
      for (const tx of txs) {
        // Deserialize the transaction as a VersionedTransaction
        const transactionBuf = Buffer.from(tx, 'base64');
        const transaction = VersionedTransaction.deserialize(transactionBuf);
  
        // Sign the transaction with the wallet
        const signedTransaction = await wallet.signTransaction(transaction);
  
        // Send the signed transaction to the Solana network
        const txid = await connection.sendRawTransaction(signedTransaction.serialize(), {
          skipPreflight: true,
          maxRetries: 2,
        });
  
        // Confirm the transaction
        await connection.confirmTransaction(txid);
        console.log('Transaction confirmed:', txid);
      }
  
      // Refresh open orders after cancellation
      const orders = await fetchOpenOrders(wallet.publicKey.toString());
      setOpenOrders(orders);
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const fetchOpenOrders = async (walletAddress) => {
    try {
      const openOrdersResponse = await axios.get(`https://api.jup.ag/limit/v2/openOrders?wallet=${walletAddress}`);
      const orderHistoryResponse = await axios.get(`https://api.jup.ag/limit/v2/orderHistory?wallet=${walletAddress}`);
  
      return {
        openOrders: openOrdersResponse.data || [],
        orderHistory: orderHistoryResponse.data || { orders: [] },
      };
    } catch (error) {
      console.error('Error fetching open orders:', error);
      return { openOrders: [], orderHistory: { orders: [] } };
    }
  };
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  const handleSelectToken = (token, type) => {
    if (type === 'from') {
      setFromToken(token.symbol);
      const tokenMint = token.address;
      setInputMintToken(tokenMint);
    } else {
      setToToken(token.symbol);
      const tokenMint = token.address;
      setOutputMintToken(tokenMint);
    }
    setIsTokenSelectModalOpen(false);
  };

  const handleConnectWallet = async () => {
    try {
      if (!wallet.connected) {
        await wallet.connect();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setOrderStatus('Failed to connect wallet. Please select a wallet.');
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleHalf = () => {
    if (fromBalance) {
      const halfBalance = (parseFloat(fromBalance) / 2).toString();
      setAmount(halfBalance);
    }
  };

  const handleMax = () => {
    if (fromBalance) {
      setAmount(fromBalance.toString());
    }
  };

  const totalUSDC = (amount && price && prices[toToken])
    ? ((amount * price) / prices[toToken]).toFixed(2)
    : '0.00';

    const renderOpenOrdersTable = (orders) => {
      if (!Array.isArray(orders) || orders.length === 0) {
        return <tr><td colSpan="6">No open orders found.</td></tr>;
      }
    
      return orders.map((order) => {
        const inputMint = order.account.inputMint;
        const outputMint = order.account.outputMint;
        const makingAmount = parseFloat(order.account.makingAmount) / Math.pow(10, getDecimalOfMint(inputMint, allVerifiedTokens));
        const takingAmount = parseFloat(order.account.takingAmount) / Math.pow(10, getDecimalOfMint(outputMint, allVerifiedTokens));
        const price = takingAmount / makingAmount;
    
        return (
          <tr key={order.publicKey}>
            <td style={{ display: 'none' }}>{order.publicKey}</td>
            <td>
              {getSymbolFromMint(inputMint, tokens)} ➡️ {getSymbolFromMint(outputMint, tokens)}
            </td>
            <td>{price.toFixed(6)}</td>
            <td>{order.account.expiredAt || 'Never'}</td>
            <td>{makingAmount.toFixed(6)} {getSymbolFromMint(inputMint, tokens)}</td>
            <td>
              <button onClick={() => handleCancelOrder(order.publicKey)}>Cancel</button>
            </td>
          </tr>
        );
      });
    };
    
    const renderHistoryTable = (history) => {
      if (!Array.isArray(history.orders) || history.orders.length === 0) {
        return <tr><td colSpan="6">No order history found.</td></tr>;
      }
    
      return history.orders.map((order) => {
        const inputMint = order.inputMint;
        const outputMint = order.outputMint;
        const makingAmount = parseFloat(order.makingAmount);
        const takingAmount = parseFloat(order.takingAmount);
        const createdAt = new Date(order.createdAt).toLocaleString();
        const status = order.status;
    
        return (
          <tr key={order.orderKey || order.closeTx}>
            <td style={{ display: 'none' }}>{order.orderKey || order.closeTx}</td>
            <td>
              {getSymbolFromMint(inputMint, tokens)} ➡️ {getSymbolFromMint(outputMint, tokens)}
            </td>
            <td>{makingAmount.toFixed(6)} {getSymbolFromMint(inputMint, tokens)}</td>
            <td>{takingAmount.toFixed(6)} {getSymbolFromMint(outputMint, tokens)}</td>
            <td>{createdAt}</td>
            <td>{status}</td>
          </tr>
        );
      });
    };

  // Generate the TradingView symbol based on the selected tokens
  const tradingViewSymbol = `${fromToken}:${toToken}`;

  return (
    <div>
      <div className="limit-order-page">
        <div className="limit-order-price-chart-container">
          <TradingViewWidget fromToken={fromToken} toToken={toToken} />
        </div>
        <div className="limit-order-container">
          {orderStatus && <p>{orderStatus}</p>}
          <div className="balance-info">
              <span></span>
              <div className="balance-actions">
                <button onClick={handleHalf} className="balance-btn">Half</button>
                <button onClick={handleMax} className="balance-btn">Max</button>
              </div>
            </div>
          <div className="limit-order-section">
            <div className="limit-order-section-header">
              <h3>You're Selling</h3>
              <div className="right-section">
                <img src={tokenAmount} alt="Token" />
                <span>{fromBalance} {fromToken}</span>
              </div>
            </div>
            <div className="limit-order-input-group">
              <button 
                className="token-select-button"
                onClick={() => {
                  setSelectingFor('from');
                  setIsTokenSelectModalOpen(true);
                }}
              >
                {fromToken ? (
                  <>
                    <img 
                      src={tokens.find(t => t.symbol === fromToken)?.logoURI} 
                      className="token-icon"
                    />
                    <span>{fromToken}</span>
                  </>
                ) : (
                  'Select Token'
                )}
                <span className="dropdown-arrow">▼</span>
              </button>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.5 sol"
                style={{ marginLeft: '10px', width: '100px',padding: '10px' }}
              />
            </div>
          </div>

          <div className="limit-order-section">
            <div className="limit-order-section-header">
              <h3>You're Buying</h3>
              <div className="right-section">
                <span>{totalUSDC} {toToken}</span>
              </div>
            </div>
            <div className="limit-order-input-group">
              <button 
                className="token-select-button"
                onClick={() => {
                  setSelectingFor('to');
                  setIsTokenSelectModalOpen(true);
                }}
              >
                {toToken ? (
                  <>
                    <img 
                      src={tokens.find(t => t.symbol === toToken)?.logoURI} 
                      className="token-icon"
                    />
                    <span>{toToken}</span>
                  </>
                ) : (
                  'Select Token'
                )}
                <span className="dropdown-arrow">▼</span>
              </button>
            </div>
            <div className="limit-order-limit-price-group">
              <label>Sell {fromToken} at rate</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="limit-order-input"
                style={{padding: '10px', marginLeft: '0px' }}
              />
            </div>
          </div>

          <button 
            disabled={!wallet.connected} 
            onClick={wallet.connected ? handlePlaceOrder : handleConnectWallet} 
            className="limit-order-button wallet-adapter-button"
          >
            {wallet.connected ? 'Place limit order': 'Connect wallet'}
          </button>

          <TokenSelectModal
            isOpen={isTokenSelectModalOpen}
            tokens={tokens}
            onSelectToken={(token) => handleSelectToken(token, selectingFor)}
            onClose={() => setIsTokenSelectModalOpen(false)}
          />

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
              <label>Buy {toToken} at Rate</label>
              <label>${parseInt(price) || 0}</label>
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
          <div 
            className={`tab-item ${activeTab === 'openOrders' ? 'active' : ''}`} 
            onClick={() => handleTabClick('openOrders')}
          >
            Open Orders
          </div>
          <div 
            className={`tab-item ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => handleTabClick('history')}
          >
            History
          </div>
        </div>
        {wallet.connected? (
          <div className="tab-content">
          {activeTab === 'openOrders' && (
            <div className="order-table">
              <table>
                <thead>
                  <tr>
                    <th style={{display:'none'}}>Order id</th>
                    <th>Order Info</th>
                    <th>Price</th>
                    <th>Expiry</th>
                    <th>Size</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {renderOpenOrdersTable(openOrders)}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'history' && (
            <div className="order-table">
              <table>
                <thead>
                  <tr>
                    <th style={{display:'none'}} >Order ID</th>
                    <th>Pair</th>
                    <th>Sell</th>
                    <th>Buy</th>
                    <th>Date</th>
                    <th>State</th>
                    <th style={{display:'none'}}></th>
                  </tr>
                </thead>
                <tbody>
                  {renderHistoryTable(orderHistory)}
                </tbody>
              </table>
            </div>
          )}
        </div>): (<span>Pease connect wallet</span>) }
      </div>
    </div>
  );
};

export default LimitOrder;
