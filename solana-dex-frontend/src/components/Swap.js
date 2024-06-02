import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const Swap = () => {
  const { publicKey, signTransaction } = useWallet();
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSwap = async () => {
    if (!publicKey) {
      setStatusMessage('Connect your wallet first');
      return;
    }

    // Perform swap logic here
    setStatusMessage('Swap functionality is not implemented yet.');
  };

  return (
    <div className="token-swap-container">
      <div className="token-swap">
        <h3>Swap</h3>
        <p>You’re paying</p>
        <div className="swap-input">
          <input type="text" placeholder="USDC" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} />
        </div>
        <p>To receive</p>
        <div className="swap-input">
          <input type="text" placeholder="SOL" value={amountOut} onChange={(e) => setAmountOut(e.target.value)} />
        </div>
        <button onClick={handleSwap}>Connect Wallet</button>
        <p>{statusMessage}</p>
      </div>
    </div>
  );
};

export default Swap;
