import React, { useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import bs58 from 'bs58';
import '../styles/YieldFarmingPage.css';

const YieldFarmingPage = () => {
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [addLiquidityAmount, setAddLiquidityAmount] = useState('');
  const [removeLiquidityAmount, setRemoveLiquidityAmount] = useState('');
  const [status, setStatus] = useState('');

  const pools = [
    { name: 'SOL/USDT', tvl: '$1,000,000', apr: '12%', volume: '$500,000', liquidityPool: 'LIQUIDITY_POOL_ADDRESS_1' },
    { name: 'SOL/USDC', tvl: '$750,000', apr: '10%', volume: '$300,000', liquidityPool: 'LIQUIDITY_POOL_ADDRESS_2' },
    // Add more pools here with actual liquidity pool addresses
  ];

  const handleTransaction = async (transaction) => {
    try {
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const walletPrivateKey = 'YOUR_WALLET_PRIVATE_KEY'; // Replace with your actual wallet private key
      const wallet = Keypair.fromSecretKey(bs58.decode(walletPrivateKey));

      transaction.feePayer = wallet.publicKey;
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      transaction.sign(wallet);
      const signature = await connection.sendTransaction(transaction, [wallet]);
      await connection.confirmTransaction(signature);

      setStatus(`Transaction successful! ID: ${signature}`);
    } catch (error) {
      console.error('Error executing transaction:', error);
      setStatus('Transaction failed. Please try again.');
    }
  };

  const handleStake = async () => {
    try {
      const transaction = new Transaction().add(
        // Add your stake logic here (e.g., interacting with Raydium farm contracts)
        SystemProgram.transfer({
          fromPubkey: 'WALLET_PUBLIC_KEY', // Replace with the user's wallet public key
          toPubkey: new PublicKey(selectedPool.liquidityPool), // Replace with the actual pool address
          lamports: stakeAmount * 1e9, // Assuming SOL, convert to lamports
        })
      );

      await handleTransaction(transaction);
    } catch (error) {
      console.error('Error staking:', error);
      setStatus('Staking failed. Please try again.');
    }
  };

  const handleUnstake = async () => {
    try {
      const transaction = new Transaction().add(
        // Add your unstake logic here
        SystemProgram.transfer({
          fromPubkey: new PublicKey(selectedPool.liquidityPool),
          toPubkey: 'WALLET_PUBLIC_KEY', // Replace with the user's wallet public key
          lamports: unstakeAmount * 1e9,
        })
      );

      await handleTransaction(transaction);
    } catch (error) {
      console.error('Error unstaking:', error);
      setStatus('Unstaking failed. Please try again.');
    }
  };

  const handleAddLiquidity = async () => {
    try {
      const transaction = new Transaction().add(
        // Add your add liquidity logic here
        SystemProgram.transfer({
          fromPubkey: 'WALLET_PUBLIC_KEY', // Replace with the user's wallet public key
          toPubkey: new PublicKey(selectedPool.liquidityPool),
          lamports: addLiquidityAmount * 1e9,
        })
      );

      await handleTransaction(transaction);
    } catch (error) {
      console.error('Error adding liquidity:', error);
      setStatus('Adding liquidity failed. Please try again.');
    }
  };

  const handleRemoveLiquidity = async () => {
    try {
      const transaction = new Transaction().add(
        // Add your remove liquidity logic here
        SystemProgram.transfer({
          fromPubkey: new PublicKey(selectedPool.liquidityPool),
          toPubkey: 'WALLET_PUBLIC_KEY', // Replace with the user's wallet public key
          lamports: removeLiquidityAmount * 1e9,
        })
      );

      await handleTransaction(transaction);
    } catch (error) {
      console.error('Error removing liquidity:', error);
      setStatus('Removing liquidity failed. Please try again.');
    }
  };

  const closeModal = () => {
    setSelectedPool(null);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="yield-farming-page">
      <h1>Yield Farming</h1>
      <p>Welcome to the Yield Farming section of the Ecosystem. Stake your tokens and earn rewards!</p>
      <div>{status && <p>{status}</p>}</div>
      <div className="pools">
        <h2>Pools</h2>
        <table>
          <thead>
            <tr>
              <th>Pool</th>
              <th>TVL</th>
              <th>APR</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool, index) => (
              <tr key={index} onClick={() => setSelectedPool(pool)}>
                <td>{pool.name}</td>
                <td>{pool.tvl}</td>
                <td>{pool.apr}</td>
                <td>{pool.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPool && (
        <div className="modal-overlay" onClick={handleOutsideClick}>
          <div className="modal" onClick={handleModalClick}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedPool.name} - Add Liquidity</h2>
            <input
              type="number"
              value={addLiquidityAmount}
              onChange={(e) => setAddLiquidityAmount(e.target.value)}
              placeholder="Amount to add"
            />
            <button onClick={handleAddLiquidity}>Add Liquidity</button>

            <h2>{selectedPool.name} - Remove Liquidity</h2>
            <input
              type="number"
              value={removeLiquidityAmount}
              onChange={(e) => setRemoveLiquidityAmount(e.target.value)}
              placeholder="Amount to remove"
            />
            <button onClick={handleRemoveLiquidity}>Remove Liquidity</button>

            <h2>{selectedPool.name} - Stake Tokens</h2>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Amount to stake"
            />
            <button onClick={handleStake}>Stake</button>

            <h2>{selectedPool.name} - Unstake Tokens</h2>
            <input
              type="number"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              placeholder="Amount to unstake"
            />
            <button onClick={handleUnstake}>Unstake</button>

            <h2>Rewards</h2>
            <button onClick={handleClaimRewards}>Claim Rewards</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YieldFarmingPage;
