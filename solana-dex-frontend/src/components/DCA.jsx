import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import { useWallet } from '@solana/wallet-adapter-react';
import '../styles/dca.css';
import { Connection} from '@solana/web3.js';
import {DCA as MyDCA, Network } from '@jup-ag/dca-sdk';
import { connection } from '../config';

const DCA = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('60');
  const [interval, setInterval] = useState(1);
  const [numOrders, setNumOrders] = useState(1);
  const [orderStatus, setOrderStatus] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [solToUsdc, setSolToUsdc] = useState(0);
  const wallet = useWallet();
  const [inputMintToken, setInputMintToken] = useState('');
  const [outputMintToken, setOutputMintToken] = useState('');
  const [iframeSrc, setIframeSrc] = useState('https://birdeye.so/tv-widget/So11111111111111111111111111111111111111112/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=AREA&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark');

  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';
  
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tokens`);
        const tokenData = response.data;
        setTokens(tokenData);

        const fromTokenData = tokenData.find(token => token.symbol === fromToken);
        const toTokenData = tokenData.find(token => token.symbol === toToken);

        if (fromTokenData && toTokenData) {
          setInputMintToken(fromTokenData.address);
          setOutputMintToken(toTokenData.address);

          // Update iframe source
          setIframeSrc(`https://birdeye.so/tv-widget/${fromTokenData.address}/${toTokenData.address}?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=AREA&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark`);

          // Derive SOL to USDC rate from token data if available
          if (fromTokenData.symbol === 'SOL' && fromTokenData.price && toTokenData.symbol === 'USDC' && toTokenData.price) {
            // If USDC price is 1 (usually stable), SOL to USDC = SOL's price
            // If not stable, adjust accordingly. Here we assume USDC price ~ 1:
            setSolToUsdc(fromTokenData.price);
          }
        }

      } catch (error) {
        console.error('Error fetching tokens:', error);
        setOrderStatus('Failed to fetch tokens');
      }
    };

    fetchTokens();
  }, [fromToken, toToken, API_BASE_URL]);

  useEffect(() => {
    if (inputMintToken && outputMintToken) {
      setIframeSrc(`https://birdeye.so/tv-widget/${inputMintToken}/${outputMintToken}?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=AREA&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark`);
    }
  }, [inputMintToken, outputMintToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/dca-order`, {
        fromToken,
        toToken
      });
      setOrderStatus('DCA ordering...!');

      const dca = new MyDCA(connection, Network.MAINNET);
      console.log('WalletPubKey', wallet.publicKey);
      const params = {
        payer: wallet.publicKey,
        user: wallet.publicKey,
        inAmount: numOrders * amount * Math.pow(10, res.data.orderResult.inputDecimal),
        inAmountPerCycle: amount * Math.pow(10, res.data.orderResult.inputDecimal),
        cycleSecondsApart: parseInt(frequency),
        inputMint: res.data.orderResult.inputMint,
        outputMint: res.data.orderResult.outputMint,
        minOutAmountPerCycle: null,
        maxOutAmountPerCycle: null,
        startAt: null,
      };
      console.log(params);
      const { tx } = await dca.createDcaV2(params);
      console.log(tx);
      const latestBlockHash = await connection.getLatestBlockhash();
      tx.recentBlockhash = latestBlockHash.blockhash;
      const txid = await wallet.sendTransaction(tx, connection);
      setOrderStatus(`Transaction sent. Confirming...`);
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
      });
      setOrderStatus(`Succeed to place DCA order. Transaction ID: ${txid}`);

    } catch (error) {
      console.error('Error placing DCA order:', error);
      setOrderStatus('Failed to place DCA order. Please try again.');
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

  const equivalentUsdc = solToUsdc ? (amount * solToUsdc).toFixed(2) : '0.00';

  return (
    <div className='dca-page'>
      <div className='dca-page-section'>
        <iframe 
          title='DCA Trading IFrame'
          width="100%" 
          height="600" 
          src={iframeSrc}>
        </iframe>
      </div>
      <div className="dca-page-chart">
        {orderStatus && <p>{orderStatus}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="from-token">I Want To Allocate</label>
            <div className="inline-fields">
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
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.2"
                min={0}
                step={0.1}
                required
                style={{ marginLeft: '10px', width: '100px', padding: '10px', marginTop: '10px' }}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="to-token">To buy</label>
            <Dropdown
              tokens={tokens}
              selectedToken={toToken}
              onSelectToken={(token) => handleSelectToken(token, 'to')}
              showDropdown={showToDropdown}
              setShowDropdown={setShowToDropdown}
              style={{ width: '200px' }}
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
                style={{ marginRight: '10px', width: '50px', color: 'white' }}
              />
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
                style={{ width: '100px' }}
              >
                <option value="60">Minute</option>
                <option value="3600">Hour</option>
                <option value="86400">Day</option>
                <option value="604800">Week</option>
                <option value="77760000">Month</option>
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
                style={{ marginRight: '10px', width: '50px', color: 'white' }}
              />
              <span>orders</span>
            </div>
          </div>
          <button type="submit">Start DCA</button>
        </form>
      </div>
    </div>
  );
};

export default DCA;
