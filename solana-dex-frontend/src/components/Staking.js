import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const Staking = () => {
  const { publicKey, signTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleStake = async () => {
    if (!publicKey) {
      setStatusMessage('Connect your wallet first');
      return;
    }

    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const stakingProgramId = new PublicKey('YOUR_STAKING_PROGRAM_ID'); // Replace with your staking program ID
    const stakingAccount = new PublicKey('YOUR_STAKING_ACCOUNT'); // Replace with your staking account

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: stakingAccount,
        lamports: amount * 1000000000, // Convert SOL to lamports (1 SOL = 10^9 lamports)
      })
    );

    try {
      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(txid);
      setStatusMessage(`Staked ${amount} tokens successfully: ${txid}`);
    } catch (error) {
      setStatusMessage(`Error staking tokens: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Staking</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleStake}>Stake Tokens</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default Staking;
