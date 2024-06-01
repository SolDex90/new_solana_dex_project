import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TokenInfo = () => {
  const { tokenId } = useParams();
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await axios.get(`https://api.example.com/tokens/${tokenId}`);
        setTokenData(response.data);
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
  }, [tokenId]);

  if (!tokenData) return <p>Loading...</p>;

  return (
    <div>
      <h2>{tokenData.name}</h2>
      <p>Symbol: {tokenData.symbol}</p>
      <p>Market Cap: {tokenData.marketCap}</p>
      <p>Price: {tokenData.price}</p>
      {/* Add more token information as needed */}
    </div>
  );
};

export default TokenInfo;
