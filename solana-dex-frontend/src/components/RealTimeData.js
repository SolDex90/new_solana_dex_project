import React, { useEffect, useState } from 'react';

const RealTimeData = () => {
  const [data] = useState([]); // Remove setData since it's not being used

  useEffect(() => {
    // Comment out the WebSocket code if not needed
    // const ws = new WebSocket('wss://example.com/realtime');

    // ws.onmessage = (event) => {
    //   const newData = JSON.parse(event.data);
    //   setData((prevData) => [...prevData, newData]);
    // };

    // ws.onerror = (error) => {
    //   console.error('WebSocket error:', error);
    // };

    // return () => {
    //   ws.close();
    // };
  }, []);

  return (
    <div>
      <h2>Real-Time Data</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeData;
