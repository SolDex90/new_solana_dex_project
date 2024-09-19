import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const LiquidityPools = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const [poolData, setPoolData] = useState([]);
  const [amount, setAmount] = useState('');
  const [poolStatus, setPoolStatus] = useState('');

  useEffect(() => {
    // Fetch existing pool data
    const fetchPoolData = async () => {
      // Implement logic to fetch pool data
      const data = [
        { name: 'Pool 1', liquidity: 1000, address: 'POOL_1_ADDRESS' }, // Replace with actual pool address
        { name: 'Pool 2', liquidity: 2000, address: 'POOL_2_ADDRESS' }, // Replace with actual pool address
      ];
      setPoolData(data);
    };

    fetchPoolData();
  }, []);

  const handleAddLiquidity = async (pool) => {
    if (!connected) {
      setPoolStatus('Please connect your wallet.');
      return;
    }

    const connection = new Connection('https://api.devnet.solana.com');
    const poolAddress = new PublicKey(pool.address);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: poolAddress,
        lamports: amount * 1000000000, // Convert SOL to lamports (1 SOL = 10^9 lamports)
      })
    );

    try {
      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(txid);
      setPoolStatus(`Added ${amount} liquidity to ${pool.name} successfully: ${txid}`);
    } catch (error) {
      setPoolStatus(`Error adding liquidity: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Liquidity Pools</h2>
      <ul>
        {poolData.map((pool) => (
          <li key={pool.name}>
            {pool.name}: {pool.liquidity} liquidity
            <input
              type="number"
              placeholder="Amount to add"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={() => handleAddLiquidity(pool)}>Add Liquidity</button>
          </li>
        ))}
      </ul>
      <p>{poolStatus}</p>
    </div>
  );
};

export default LiquidityPools;
