import React from 'react';
import { Line } from 'react-chartjs-2';

const PortfolioPerformance = () => {
  // Fetch and display historical performance data
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="card" style={{ width: '600px', margin: '0 auto' }}>
      <h3>Portfolio Performance</h3>
      <div style={{ height: '300px' }}>
        <Line data={data} />
      </div>
    </div>
  );
};

export default PortfolioPerformance;
