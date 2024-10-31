import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Wallet = () => {
  const { publicKey, connect, disconnect, connected, wallet } = useWallet();
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (connected && wallet.adapter.name === 'Ledger') {
      console.log('Ledger connected:', publicKey?.toBase58());
      setStatusMessage(`Connected to Ledger: ${publicKey?.toBase58()}`);
    } else if (connected) {
      setStatusMessage(`Connected to ${wallet.adapter.name}: ${publicKey?.toBase58()}`);
    } else {
      setStatusMessage('Please connect your wallet');
    }
  }, [connected, wallet, publicKey]);

  return (
    <main>
      <h2>Wallet Page</h2>
      <WalletMultiButton />
      <div className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}>
        {statusMessage}
      </div>
      {connected ? (
        <div>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          <button onClick={connect}>Connect Wallet</button>
        </div>
      )}
    </main>
  );
};

export default Wallet;
