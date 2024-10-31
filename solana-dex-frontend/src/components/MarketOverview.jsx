import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarketOverview = () => {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await axios.get('https://api.exchange.com/markets');
        setMarkets(response.data);
      } catch (error) {
        console.error('Error fetching markets:', error);
      }
    };

    fetchMarkets();
  }, []);

  return (
    <div>
      <h2>Market Overview</h2>
      <ul>
        {markets.map((market, index) => (
          <li key={index}>
            {market.pair}: {market.price} (24h: {market.change}%)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarketOverview;
