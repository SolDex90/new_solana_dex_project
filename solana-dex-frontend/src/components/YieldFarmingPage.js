import React, { useState } from 'react';
import '../styles/YieldFarmingPage.css';

const YieldFarmingPage = () => {
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [addLiquidityAmount, setAddLiquidityAmount] = useState('');
  const [removeLiquidityAmount, setRemoveLiquidityAmount] = useState('');

  const pools = [
    { name: 'SOL/USDT', tvl: '$1,000,000', apr: '12%', volume: '$500,000' },
    { name: 'SOL/USDC', tvl: '$750,000', apr: '10%', volume: '$300,000' },
    { name: 'SOL/BONK', tvl: '$500,000', apr: '15%', volume: '$200,000' },
    { name: 'SOL/WIF', tvl: '$600,000', apr: '14%', volume: '$250,000' },
  ];

  const handleStake = () => {
    // Add logic for staking tokens
  };

  const handleUnstake = () => {
    // Add logic for unstaking tokens
  };

  const handleClaimRewards = () => {
    // Add logic for claiming rewards
  };

  const handleAddLiquidity = () => {
    // Add logic for adding liquidity
  };

  const handleRemoveLiquidity = () => {
    // Add logic for removing liquidity
  };

  const closeModal = () => {
    setSelectedPool(null);
  };

  return (
    <div className="yield-farming-page">
      <h1>Yield Farming</h1>
      <p>Welcome to the Yield Farming section of the Ecosystem. Stake your tokens and earn rewards!</p>

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
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
