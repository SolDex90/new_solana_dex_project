import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react'; // Import the wallet adapter hook
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import '../styles/token-swap.css';

const Swap = () => {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  
  const { publicKey, signTransaction } = useWallet(); // Use wallet adapter hook

  const handleSwap = async () => {
    try {
      setStatus('Fetching best route...');
      const connection = new Connection('https://api.mainnet-beta.solana.com');

      if (!publicKey || !signTransaction) {
        setStatus('Wallet not connected');
        return;
      }

      // Fetch the best swap route from Jupiter
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken}&outputMint=${toToken}&amount=${amount}&slippageBps=50`
      ).then(res => res.json());

      if (!quoteResponse.data || quoteResponse.data.length === 0) {
        setStatus('No available route found.');
        return;
      }

      setStatus('Route found. Preparing transaction...');

      // Prepare the swap transaction
      const swapTransaction = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: publicKey.toString(),
        }),
      }).then(res => res.json());

      const transaction = VersionedTransaction.deserialize(Buffer.from(swapTransaction.swapTransaction, 'base64'));

      // Sign the transaction with the user's wallet
      const signedTransaction = await signTransaction(transaction);

      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction);

      await connection.confirmTransaction(txid);
      setStatus(`Swap successful! Transaction ID: ${txid}`);
    } catch (error) {
      console.error('Error during swap:', error);
      setStatus('Swap failed. Please try again.');
    }
  };

  return (
    <div className="token-swap-container">
      <div className="token-swap">
        <h3>Token Swap</h3>
        {status && <p>{status}</p>}
        <div className="swap-input">
          <label htmlFor="from-token">From:</label>
          <input
            type="text"
            id="from-token"
            placeholder="Enter token mint address"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          />
        </div>
        <div className="swap-input">
          <label htmlFor="to-token">To:</label>
          <input
            type="text"
            id="to-token"
            placeholder="Enter token mint address"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
          />
        </div>
        <div className="swap-input">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleSwap}>Swap</button>
      </div>
    </div>
  );
};

export default Swap;
