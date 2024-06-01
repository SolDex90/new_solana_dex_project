import React from 'react';

const PortfolioAnalytics = ({ portfolio = [] }) => {  // Set default value to an empty array
  const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);
  const gains = portfolio.reduce((sum, asset) => sum + asset.gain, 0);

  return (
    <div>
      <h2>Portfolio Analytics</h2>
      <p>Total Value: ${totalValue.toFixed(2)}</p>
      <p>Total Gains: ${gains.toFixed(2)}</p>
      {/* Add more analytics as needed */}
    </div>
  );
};

export default PortfolioAnalytics;
