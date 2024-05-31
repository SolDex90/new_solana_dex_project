// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import WalletProvider from './WalletProvider';
import '@solana/wallet-adapter-react-ui/styles.css'; // Import wallet adapter styles

ReactDOM.render(
  <WalletProvider>
    <App />
  </WalletProvider>,
  document.getElementById('root')
);
