import React, { useEffect, useState } from 'react';

const RealTimeData = () => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://example.com/realtime'); // Replace with actual WebSocket URL

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(data.price);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>Real-Time Price: {price ? `$${price}` : 'Loading...'}</h2>
    </div>
  );
};

export default RealTimeData;
