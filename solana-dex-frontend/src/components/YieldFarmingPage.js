import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/YieldFarmingPage.css';

const YieldFarmingPage = () => {
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [addLiquidityAmount, setAddLiquidityAmount] = useState('');
  const [removeLiquidityAmount, setRemoveLiquidityAmount] = useState('');
  const [pools, setPools] = useState([]);

  useEffect(()=>{
    const fetchPools = async ()=> {
      const res = axios.get('https://docs-demo.stellar-mainnet.quiknode.pro/liquidity_pools');
      console.log("Pools:", res);
    }
    fetchPools();
;  });
  
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

  const handleModalClick = (e) => {
    // Prevent closing if the click was inside the modal content
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
