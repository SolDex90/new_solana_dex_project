// src/components/Header.js
import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header = () => {
  return (
    <header>
      <h1>Solana DEX</h1>
      <WalletMultiButton />
    </header>
  );
};

export default Header;
