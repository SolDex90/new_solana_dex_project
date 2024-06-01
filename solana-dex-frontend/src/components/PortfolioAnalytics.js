import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioAnalytics = ({ portfolio = [] }) => {
  const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);
  const gains = portfolio.reduce((sum, asset) => sum + asset.gain, 0);

  const assetAllocationData = {
    labels: portfolio.map(asset => asset.name),
    datasets: [
      {
        data: portfolio.map(asset => asset.value),
        backgroundColor: portfolio.map((_, index) => `hsl(${index * 60}, 70%, 50%)`),
      }
    ]
  };

  const assetAllocationOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Asset Allocation',
      },
    },
  };

  return (
    <div>
      <h2>Portfolio Analytics</h2>
      <div>
        <h3>Summary</h3>
        <p>Total Value: ${totalValue.toFixed(2)}</p>
        <p>Total Gains: ${gains.toFixed(2)}</p>
      </div>
      <div>
        <h3>Asset Allocation</h3>
        <Pie data={assetAllocationData} options={assetAllocationOptions} />
      </div>
      <div>
        <h3>Details</h3>
        <ul>
          {portfolio.map((asset, index) => (
            <li key={index}>
              {asset.name}: {asset.amount} (${asset.value.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>
      {/* Add more detailed analytics and visualizations as needed */}
    </div>
  );
};

export default PortfolioAnalytics;
