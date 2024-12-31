import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSync } from 'react-icons/fa';
import Dropdown from './Dropdown';
import AmountInput from './AmountInput';
import SwapButton from './SwapButton';
import Slippage from './Slippage';
import PriceDisplay from './PriceDisplay';
import SlippageModal from './SlippageModal';
import '../styles/token-swap.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction, Connection } from '@solana/web3.js';
import toggle from '../images/toggle.png';
import { connection } from '../config';

const TokenSwap = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [fromTokenAddress, setFromTokenAddress] = useState('');
  const [toTokenAddress, setToTokenAddress] = useState('');
  const [Decimals, setDecimals] = useState('');
  const [fromTokenDecimals, setFromTokenDecimals] = useState(0);
  const [toTokenDecimals, setToTokenDecimals] = useState(0);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [slippage, setSlippage] = useState(0.5); // default slippage tolerance
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);
  const wallet = useWallet();

  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tokens`);
        const tokenData = response.data;
  
        if (!Array.isArray(tokenData)) {
          throw new Error('Expected an array of tokens but received something else');
        }
  
        setTokens(tokenData);
  
        const solToken = tokenData.find((t) => t.symbol === 'SOL');
        const usdcToken = tokenData.find((t) => t.symbol === 'USDC');
  
        if (solToken) {
          setFromTokenAddress(solToken.address);
          setFromTokenDecimals(solToken.decimals);
        }
  
        if (usdcToken) {
          setToTokenAddress(usdcToken.address);
          setToTokenDecimals(usdcToken.decimals);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setError('Failed to fetch tokens');
      }
    };
  
    fetchTokens();
  }, [API_BASE_URL]);

  const fetchPrices = async (tokenIds) => {
    setLoading(true);
    setError(null);
    try {
      const jupiterResponse = await axios.get(`https://api.jup.ag/price/v2?ids=${tokenIds.join(',')}`);
      
      // Extract prices from the response
      const prices = {};
      for (const tokenId of tokenIds) {
          const token = tokens.find(t => t.address === tokenId);
          prices[token.symbol] = jupiterResponse.data.data[tokenId]?.price || 'Price not available';
      }
      console.log(prices);

      setPrices(prices);
    } catch (error) {
      console.error('Error fetching prices from Jupiter API:', error);
      setError('Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromToken && toToken && tokens.length > 0) {
      const token1 = tokens.find(t => t.symbol === fromToken);
      const token2 = tokens.find(t => t.symbol === toToken);
      fetchPrices([token1? token1.address : null, token2? token2.address : null]);

    }
  }, [fromToken, toToken, tokens]);

  useEffect(() => {
    if (fromAmount && prices[fromToken] && prices[toToken]) {
      const fromPrice = prices[fromToken];
      const toPrice = prices[toToken];
      const convertedAmount = (fromAmount * fromPrice / toPrice).toFixed(10);
      setToAmount(convertedAmount);
    } else {
      setToAmount('');
    }
  }, [fromAmount, prices, fromToken, toToken]);

  const handleSelectToken = async (tokenSymbol, type) => {
    const token = tokens.find((t) => t.symbol === tokenSymbol);
    if (token) {
      if (type === 'from') {
        setFromToken(token.symbol);
        setFromTokenAddress(token.address);
        setFromTokenDecimals(token.decimals); 
      } else {
        setToToken(token.symbol);
        setToTokenAddress(token.address);
        setToTokenDecimals(token.decimals); 
      }
    }
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromTokenAddress(toTokenAddress);
    setToTokenAddress(fromTokenAddress);
    setFromTokenDecimals(toTokenDecimals); 
    setToTokenDecimals(fromTokenDecimals);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    console.log(connection);
    setTransactionStatus('Initiating transaction...');
    const walletAddress = wallet.publicKey;
  
    try {
      
      if (!fromTokenAddress || !toTokenAddress || !fromTokenDecimals) {
        throw new Error('Token information is missing. Please reselect the tokens.');
      }
  
      const payload = {
        fromToken: fromTokenAddress,
        toToken: toTokenAddress,
        decimals: fromTokenDecimals,
        fromAmount,
        toAmount,
        walletAddress,
        slippage,
      };
      console.log('Swap Payload:', payload);
  
      const res = await axios.post(`${API_BASE_URL}/api/swap`, payload);
      console.log('Swap Response:', res.data);
  
      setTransactionStatus('Signing transaction...');
      const swapTransaction = res.data.swapResult;
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signTransaction = await wallet.signTransaction(transaction);
      setTransactionStatus('Sending signed transaction to Solana Network');
      const latestBlockhash = await connection.getLatestBlockhash();
      const txid = await connection.sendRawTransaction(signTransaction.serialize());
  
      setTransactionStatus('Confirming...');
      await connection.confirmTransaction({
        blockhash: latestBlockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txid,
      });
  
      setTransactionStatus(`Transaction succeed! Transaction ID: ${txid}`);
      console.log(`https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error('Error during transaction:', error);
      console.error('Response:', error.response);
      setTransactionStatus('Transaction failed. Please try again.');
    }
  };

  const handleRefresh = () => {
    if (fromToken && toToken) {
      fetchPrices([fromToken, toToken]);
    }
  };

  return (
    <div className="token-swap-container">
      <div className="header">
        {/* <FaSync className="refresh-icon" onClick={handleRefresh} />
        <Slippage slippage={slippage} setIsSlippageModalOpen={setIsSlippageModalOpen} /> */}
      </div>
      <div className='token-swap-body'>
        <div className="token-swap">
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {transactionStatus && <p>{transactionStatus}</p>}
          <div className="token-swap-inputs">
            <div className="token-swap-input">
              <label>You're Selling:</label>
              <div className="input-group">
                <Dropdown
                  tokens={tokens}
                  selectedToken={fromToken}
                  onSelectToken={(token) => handleSelectToken(token, 'from')}
                  showDropdown={showFromDropdown}
                  setShowDropdown={setShowFromDropdown}
                />
                <AmountInput
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </div>
            <div className="flip-button-container">
              {/* <SwapButton onClick={handleFlip} /> */}
              <div onClick={handleFlip}>
                <img src={toggle}/>
              </div> 
            </div>
            

            <div className="token-swap-input">
              <label>You're Buying:</label>
              <div className="input-group">
                <Dropdown
                  tokens={tokens}
                  selectedToken={toToken}
                  onSelectToken={(token) => handleSelectToken(token, 'to')}
                  showDropdown={showToDropdown}
                  setShowDropdown={setShowToDropdown}
                />
                <AmountInput
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>
          <div  className='handle-swap-btn'>
            <button onClick={handleSwap}>Swap</button>
          </div>
          <SlippageModal
            isOpen={isSlippageModalOpen}
            onRequestClose={() => setIsSlippageModalOpen(false)}
            slippage={slippage}
            setSlippage={setSlippage}
          />
          <PriceDisplay fromToken={fromToken} toToken={toToken} prices={prices} />
        </div>
        <div className="settings-container">
          <div className="settings-item">
              <label className="setting-label">
                  MEV Protection
                  <span className="info-icon">i</span>
              </label>
              <label className="switch">
                  <input type="checkbox"/>
                  <span className="slider round"></span>
              </label>
          </div>
          
          <div className="settings-item">
              <label className="setting-label">
                  Slippage Settings
                  <span className="info-icon">i</span>
              </label>
              <div className="slippage-options">
                <Slippage slippage={slippage} setIsSlippageModalOpen={setIsSlippageModalOpen} />
              </div>
          </div>

          <div className="settings-item">
              <label className="setting-label">Max Slippage:</label>
              <input type="text" className="slippage-input" value="3%" readOnly/>
          </div>

          <button className="save-btn">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default TokenSwap;
