import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import '../styles/limit-order.css';
import { Connection, Keypair, Transaction } from '@solana/web3.js';
import { fetchChartData } from '../fetchChartData'; // Adjust the import path if necessary
import { useWallet } from '@solana/wallet-adapter-react';

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
  const [chartData, setChartData] = useState([]);
  const [inputMintToken, setInputMintToken] = useState([]);
  const [outputMintToken, setOutputMintToken] = useState([]);
  const [iframeSrc, setIframeSrc] = useState('https://birdeye.so/tv-widget/So11111111111111111111111111111111111111112/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=AREA&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark')
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const END_POINT = process.env.RPC_END_POINT || 'https://hidden-patient-slug.solana-mainnet.quiknode.pro/d8cb6d9a7b156d44efaca020f46f9196d20bc926';
  const base = Keypair.generate();
  // Fetch tokens
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tokens`);
        setTokens(response.data);
        
        // Set the mint addresses for the default tokens
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
  }, []);

  // Fetch prices whenever fromToken, toToken, or price changes
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(`https://price.jup.ag/v6/price?ids=${fromToken},${toToken}`);
        const pricesData = response.data?.data;
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
  useEffect(() => {
    // Update iframeSrc when fromToken or toToken changes
    setIframeSrc(`https://birdeye.so/tv-widget/${inputMintToken}/${outputMintToken}?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=AREA&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark`);
  }, [inputMintToken, outputMintToken]);

  // Handle placing the order
  const handlePlaceOrder = async () => {
    if (!wallet){
      setOrderStatus('Please Connect Wallet!');
      return;
    }
    try {
      setOrderStatus('initiating transaction...');
      const connection = new Connection(END_POINT);
      const walletAddress = wallet.publicKey;
      const sendingBase = base.publicKey.toString();
      const res = await axios.post(`${API_BASE_URL}/api/limit-order`,{
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
      var transaction = Transaction.from(transactionBuf);
      const signedTransaction = await wallet.signTransaction(transaction)
      signedTransaction.partialSign(base);

      const latestBlockhash = await connection.getLatestBlockhash();
      console.log('LATEST BLOCKHASH:', latestBlockhash);
      
      const txid = await connection.sendRawTransaction(signedTransaction.serialize(),{
        skipPreflight:true,
        maxRetries:2,
      });
      await connection.confirmTransaction({
        blockhash:latestBlockhash,
        lastValidBlockHeight:latestBlockhash.lastValidBlockHeight,
        signature:txid
      })
      setOrderStatus(`Transaction succeed! Transaction ID: ${txid}`);  
      console.log(`https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error('Error during order placement:', error);
      setOrderStatus('Order placement failed. Please try again.');
    }
  };

  //const iframeSrc = `https://birdeye.so/tv-widget/${inputMintToken}/${outputMintToken}?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=AREA&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark`;

  const handleSelectToken = (token, type) => {
    if (type === 'from') {
      setFromToken(token);
      setShowFromDropdown(false);
      setPrice(''); // Reset price when changing fromToken
      const tokenMint = tokens.find(tokenMint=> tokenMint.symbol === token);
      setInputMintToken(tokenMint.address);
    } else {
      setToToken(token);
      setShowToDropdown(false);
      const tokenMint = tokens.find(tokenMint=> tokenMint.symbol === token);
      setOutputMintToken(tokenMint.address);
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
        <div className="limit-order-section">
          <h3>You're buying</h3>
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
        
        <button onClick={handlePlaceOrder} className="limit-order-button">
          Place Limit Order
        </button>
      </div>
      <div className="limit-order-price-chart-container">
      <iframe 
        width="100%" 
        height="600" 
        src={iframeSrc}
        frameborder="0" 
        allowfullscreen>
      </iframe>
        {/* <TradingViewChart symbol={getTradingSymbol()} interval="1" /> */}
      </div>
    </div>
  );
};

export default LimitOrder;
