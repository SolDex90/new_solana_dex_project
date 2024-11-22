import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { connection } from '../config';

const BalanceChecker = () => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const publicKey = new PublicKey('2MTDZGGZ7kU8tnscXjZ8LTAiE1F8hmxmhiNEnff6i3kh');
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / 1000000000); // Convert lamports to SOL
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError('Error fetching balance');
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
      <h1>Your SOL Balance: {balance !== null ? `${balance} SOL` : 'Loading...'}</h1>
      {error && <p>{error}</p>}
    </div>
  );
};

export default BalanceChecker;
