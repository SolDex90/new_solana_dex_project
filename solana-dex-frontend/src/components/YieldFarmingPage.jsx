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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState('');

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const res = await axios.get('https://docs-demo.stellar-mainnet.quiknode.pro/liquidity_pools');
        setPools(res.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching pools:', error);
        setError('Failed to fetch pools.');
      } finally {
        setLoading(false);
      }
    };
    fetchPools();
  }, []);

  const handleStake = () => {
    setActionStatus('Staking tokens...');
    // Add logic for staking tokens
  };

  const handleUnstake = () => {
    setActionStatus('Unstaking tokens...');
    // Add logic for unstaking tokens
  };

  const handleClaimRewards = () => {
    setActionStatus('Claiming rewards...');
    // Add logic for claiming rewards
  };

  const handleAddLiquidity = () => {
    setActionStatus('Adding liquidity...');
    // Add logic for adding liquidity
  };

  const handleRemoveLiquidity = () => {
    setActionStatus('Removing liquidity...');
    // Add logic for removing liquidity
  };

  const closeModal = () => {
    setSelectedPool(null);
    setActionStatus(''); // Reset status message when closing modal
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevents modal close on inner click
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

      {loading ? (
        <p>Loading pools...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : pools.length === 0 ? (
        <p>No pools available at the moment.</p>
      ) : (
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
      )}

      {selectedPool && (
        <div className="modal-overlay" onClick={handleOutsideClick}>
          <div className="modal" onClick={handleModalClick}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedPool.name}</h2>

            {actionStatus && <p>{actionStatus}</p>}

            <div className="modal-section">
              <h3>Add Liquidity</h3>
              <input
                type="number"
                value={addLiquidityAmount}
                onChange={(e) => setAddLiquidityAmount(e.target.value)}
                placeholder="Amount to add"
              />
              <button onClick={handleAddLiquidity}>Add Liquidity</button>
            </div>

            <div className="modal-section">
              <h3>Remove Liquidity</h3>
              <input
                type="number"
                value={removeLiquidityAmount}
                onChange={(e) => setRemoveLiquidityAmount(e.target.value)}
                placeholder="Amount to remove"
              />
              <button onClick={handleRemoveLiquidity}>Remove Liquidity</button>
            </div>

            <div className="modal-section">
              <h3>Stake Tokens</h3>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Amount to stake"
              />
              <button onClick={handleStake}>Stake</button>
            </div>

            <div className="modal-section">
              <h3>Unstake Tokens</h3>
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder="Amount to unstake"
              />
              <button onClick={handleUnstake}>Unstake</button>
            </div>

            <div className="modal-section">
              <h3>Rewards</h3>
              <button onClick={handleClaimRewards}>Claim Rewards</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YieldFarmingPage;
