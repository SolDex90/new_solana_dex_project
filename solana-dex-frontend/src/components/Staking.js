import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const Staking = () => {
  const { publicKey, connected } = useWallet();
  const [amount, setAmount] = useState('');
  const [stakeStatus, setStakeStatus] = useState('');

  const handleStake = async () => {
    if (!connected) {
      setStakeStatus('Please connect your wallet.');
      return;
    }

    // Implement staking logic here
    // For example, call your staking smart contract with the amount

    setStakeStatus(`Staked ${amount} tokens successfully.`);
  };

  return (
    <div>
      <h2>Staking</h2>
      <input
        type="number"
        placeholder="Amount to stake"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleStake}>Stake</button>
      <p>{stakeStatus}</p>
    </div>
  );
};

export default Staking;
