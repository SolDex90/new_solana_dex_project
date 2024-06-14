import React from 'react';
import TokenSniperBot from '../components/TokenSniperBot'; // Adjust the import path if necessary
import '../styles/sniping.css'; // Ensure the path is correct

const TokenSniper = () => {
  return (
    <div className="token-sniper-page">
      <h2>Token Sniper</h2>
      <p>This is the Token Sniper page. Here you can snipe new tokens released on BirdEye.</p>
      <TokenSniperBot /> {/* Integrate the TokenSniperBot component */}
    </div>
  );
};

export default TokenSniper;
