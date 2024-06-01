import React, { useEffect, useState } from 'react';
import { getLiveTokenPrices } from '../services/coinGeckoService';

const LivePrices = ({ tokenIds }) => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      const data = await getLiveTokenPrices(tokenIds);
      setPrices(data);
    };

    fetchPrices();

    const interval = setInterval(() => {
      fetchPrices();
    }, 60000); // Fetch prices every minute

    return () => clearInterval(interval);
  }, [tokenIds]);

  return (
    <div>
      <h2>Live Token Prices</h2>
      <ul>
        {tokenIds.map((tokenId) => (
          <li key={tokenId}>
            {tokenId}: ${prices[tokenId]?.usd || 'Loading...'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LivePrices;
