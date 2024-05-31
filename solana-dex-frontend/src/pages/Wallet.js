import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// Removed the unused imports
// import Transport from "@ledgerhq/hw-transport";
// import { TransportPendingOperation } from "@ledgerhq/errors";

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
    <div>
      <h1>Wallet</h1>
      <WalletMultiButton />
      {connected ? (
        <div>
          <p>{statusMessage}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          <p>{statusMessage}</p>
          <button onClick={connect}>Connect Wallet</button>
        </div>
      )}
    </div>
  );
};

export default Wallet;
