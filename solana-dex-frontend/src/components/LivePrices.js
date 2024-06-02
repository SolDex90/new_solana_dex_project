// src/components/LivePrices.js
import React, { useEffect, useState } from 'react';
import { getCryptoPrices } from '../services/coinMarketCapService'; // Import the service

const LivePrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const symbols = ['BTC', 'ETH', 'SOL']; // Add more symbols as needed
        const data = await getCryptoPrices(symbols);
        setPrices(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) {
    return <p>Loading prices...</p>;
  }

  if (error) {
    return <p>Error fetching prices: {error.message}</p>;
  }

  return (
    <div>
      <h2>Live Token Prices</h2>
      <ul>
        {Object.keys(prices).map((symbol) => (
          <li key={symbol}>
            {symbol}: ${prices[symbol].quote.USD.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LivePrices;
