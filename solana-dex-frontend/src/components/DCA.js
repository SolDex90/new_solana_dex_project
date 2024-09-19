import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import { useWallet } from '@solana/wallet-adapter-react';
import '../styles/dca.css';
import { Connection, sendAndConfirmTransaction } from '@solana/web3.js';


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
  const wallet = useWallet();
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
    try {
      const res = await axios.post('https://api.cryptosion.io/api/dca-order', {
        fromToken,
        toToken
      });
      setOrderStatus('DCA ordering...!');
      // const connection = new Connection(process.env.RPC_END_POINT);
      // //const connection = 
      // const dca =  new MyDCA(connection, Network.DEVNET);
      // const user = wallet;
      // const params = {
      //   payer: user.publicKey,
      //   user: user.publicKey,
      //   inAmount: numOrders * amount * Math.pow(10, res.data.orderResult.inputDecimal),
      //   inAmountPerCycle: amount * Math.pow(10, res.data.orderResult.inputDecimal),
      //   cycleSecondsApart: frequency,
      //   inputMint: res.data.orderResult.inputMint,
      //   outputMint: res.data.orderResult.outputMint,
      //   minOutAmountPerCycle:null,
      //   maxOutAmountPerCycle:null,
      //   startAt:null,
      // };
      // const {tx, dcaPubKey} = await dca.createDcaV2(params);
      
      // setOrderStatus('Sending DCA order...!');
      // const txid = await sendAndConfirmTransaction(connection, tx, [wallet, wallet]);
      // setOrderStatus(`DCA order created: ${txid}`);

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
  );
};

export default DCA;
