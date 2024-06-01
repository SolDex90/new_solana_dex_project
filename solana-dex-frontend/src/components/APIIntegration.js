import React, { useState, useEffect } from 'react';
import axios from 'axios';

const APIIntegration = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>API Integration</h2>
      {data ? (
        <div>
          <p>Bitcoin: ${data.bitcoin.usd}</p>
          <p>Ethereum: ${data.ethereum.usd}</p>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default APIIntegration;
