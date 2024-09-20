import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import { useWallet } from '@solana/wallet-adapter-react';
import '../styles/dca.css';
import { Connection, Keypair, sendAndConfirmRawTransaction, Transaction,sendAndConfirmTransaction } from '@solana/web3.js';
import { CloseDCAParams, CreateDCAParamsV2, DCA as MyDCA, DepositParams, WithdrawParams, Network } from '@jup-ag/dca-sdk';

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
  const [inputMintToken, setInputMintToken] = useState([]);
  const [outputMintToken, setOutputMintToken] = useState([]);
  const [iframeSrc, setIframeSrc] = useState('https://birdeye.so/tv-widget/So11111111111111111111111111111111111111112/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=AREA&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark')
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tokens`);
        setTokens(response.data);
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

  useEffect(() => {
    // Update iframeSrc when fromToken or toToken changes
    setIframeSrc(`https://birdeye.so/tv-widget/${inputMintToken}/${outputMintToken}?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=AREA&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark`);
  }, [inputMintToken, outputMintToken]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/dca-order`, {
        fromToken,
        toToken
      });
      setOrderStatus('DCA ordering...!');
      //const connection = new Connection('https://api.devnet.solana.com');
      const connection = new Connection('https://hidden-patient-slug.solana-mainnet.quiknode.pro/d8cb6d9a7b156d44efaca020f46f9196d20bc926')
      const dca =  new MyDCA(connection, Network.MAINNET);
      console.log('WalletPubKey',wallet.publicKey);
      const params = {
        payer: wallet.publicKey,
        user: wallet.publicKey,
        inAmount: numOrders * amount * Math.pow(10, res.data.orderResult.inputDecimal),
        inAmountPerCycle: amount * Math.pow(10, res.data.orderResult.inputDecimal),
        cycleSecondsApart: parseInt(frequency),
        inputMint: res.data.orderResult.inputMint,
        outputMint: res.data.orderResult.outputMint,
        minOutAmountPerCycle:null,
        maxOutAmountPerCycle:null,
        startAt:null,
      };
      console.log(params);
      const {tx, dcaPubKey} = await dca.createDcaV2(params);
      console.log(tx);
      const latestBlockHash =await connection.getLatestBlockhash();
      tx.recentBlockhash = latestBlockHash.blockhashblockhash;
      const txid = await wallet.sendTransaction(tx, connection);
      setOrderStatus(`Transaction sent. Confirming...`);
      await connection.confirmTransaction({
        blockhash:latestBlockHash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature:txid
      });
      setOrderStatus(`Succeed to place DCA order. Transaction ID:${txid}`);

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

  const equivalentUsdc = (amount * solToUsdc).toFixed(2);

  return (
    <div className = 'dca-page'>
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
                style={{ marginRight: '10px', width: '50px' }}
              />
              <span>orders</span>
            </div>
          </div>
          <button type="submit">Start DCA</button>
        </form>
        
      </div>
      <div className='card small-card'>
        <iframe 
          width="100%" 
          height="600" 
          src={iframeSrc}
          frameborder="0" 
          allowfullscreen>
        </iframe>
      </div>
    </div>
  );
};

export default DCA;
