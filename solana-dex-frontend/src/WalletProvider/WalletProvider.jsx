import React, { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import {
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const WalletProvider = ({ children }) => {
  const endpoint = useMemo(() => 'https://billowing-palpable-sun.solana-mainnet.quiknode.pro/dcb07b108ec63c565d92b65b25d61508ff58eb05', []);
  const wallets = useMemo(
    () => [
      // Remove PhantomWalletAdapter if it's registered automatically
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
