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

const TokenSwap = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [slippage, setSlippage] = useState(0.5); // Default slippage tolerance
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);
  const wallet = useWallet();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'; // Adjust base URL if needed

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tokens`);
        const tokenData = Array.isArray(response.data) ? response.data : response.data.tokens;

        if (!Array.isArray(tokenData)) {
          throw new Error('Expected an array of tokens but received something else');
        }

        setTokens(tokenData);
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
      const jupiterResponse = await axios.get(`https://price.jup.ag/v6/price?ids=${tokenIds.join(',')}`);
      const jupiterPrices = Object.keys(jupiterResponse.data.data).reduce((acc, key) => {
        acc[jupiterResponse.data.data[key].mintSymbol] = jupiterResponse.data.data[key].price;
        return acc;
      }, {});

      setPrices(jupiterPrices);
    } catch (error) {
      console.error('Error fetching prices from Jupiter API:', error);
      setError('Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromToken && toToken) {
      fetchPrices([fromToken, toToken]);
    }
  }, [fromToken, toToken]);

  useEffect(() => {
    if (fromAmount && prices[fromToken] && prices[toToken]) {
      const fromPrice = prices[fromToken];
      const toPrice = prices[toToken];
      const convertedAmount = (fromAmount * fromPrice / toPrice).toFixed(6); // Limit decimals
      setToAmount(convertedAmount);
    } else {
      setToAmount('');
    }
  }, [fromAmount, prices, fromToken, toToken]);

  const handleSelectToken = (token, type) => {
    if (type === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  const handleFlip = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    const connection = new Connection('https://hidden-patient-slug.solana-mainnet.quiknode.pro/d8cb6d9a7b156d44efaca020f46f9196d20bc926');
    setTransactionStatus('Initiating transaction...');

    try {
      if (!wallet || !wallet.connected) {
        setTransactionStatus('Please connect your wallet first.');
        return;
      }

      const walletAddress = wallet.publicKey.toString(); // Convert wallet address to string

      const res = await axios.post(`${API_BASE_URL}/api/swap`, {
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        walletAddress,
        slippage,
      });

      setTransactionStatus('Signing transaction...');
      const { swapResult } = res.data;

      if (!swapResult) {
        throw new Error('Swap transaction not found in response');
      }

      const swapTransactionBuf = Buffer.from(swapResult, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      const signedTransaction = await wallet.signTransaction(transaction);
      setTransactionStatus('Sending signed transaction to Solana Network');

      const latestBlockhash = await connection.getLatestBlockhash();
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());

      setTransactionStatus('Confirming...');
      await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txid,
      });

      setTransactionStatus(`Transaction succeeded! Transaction ID: ${txid}`);
      console.log(`https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error('Error during transaction:', error);
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
        <FaSync className="refresh-icon" onClick={handleRefresh} />
        <Slippage slippage={slippage} setIsSlippageModalOpen={setIsSlippageModalOpen} />
      </div>
      <div className="token-swap">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {transactionStatus && <p>{transactionStatus}</p>}
        <div className="token-swap-inputs">
          <div className="token-swap-input">
            <label>From:</label>
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
                placeholder="Amount"
              />
            </div>
          </div>
          <div className="flip-button-container">
            <SwapButton onClick={handleFlip} />
          </div>
          <div className="token-swap-input">
            <label>To:</label>
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
                placeholder="Amount"
              />
            </div>
          </div>
        </div>
        <button onClick={handleSwap}>Swap</button>
        <SlippageModal
          isOpen={isSlippageModalOpen}
          onRequestClose={() => setIsSlippageModalOpen(false)}
          slippage={slippage}
          setSlippage={setSlippage}
        />
        <PriceDisplay fromToken={fromToken} toToken={toToken} prices={prices} />
      </div>
    </div>
  );
};

export default TokenSwap;
