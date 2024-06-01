import React, { useState } from 'react';

const SocialTrading = () => {
  const [traders, setTraders] = useState([
    { name: 'Trader Joe', trades: 120, followers: 300 },
    { name: 'CryptoQueen', trades: 200, followers: 500 },
  ]);

  return (
    <div>
      <h2>Social Trading</h2>
      <ul>
        {traders.map((trader, index) => (
          <li key={index}>
            {trader.name}: {trader.trades} trades, {trader.followers} followers
            <button>Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialTrading;
