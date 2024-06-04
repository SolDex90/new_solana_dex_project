import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../styles/styles.css';

const RealTimeData = () => {
  const [data] = useState([]); // Remove setData since it's not being used

  // Example chart data
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Token Price',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

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
      <div className="chart-container">
        <Line data={chartData} />
      </div>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeData;
