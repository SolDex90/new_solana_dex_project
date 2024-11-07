import React, { useState } from 'react';

const PortfolioManagement = () => {
  const [portfolio] = useState([
    { token: 'BTC', amount: 1 },
    { token: 'ETH', amount: 10 },
  ]);

  return (
    <div>
      <h2>Portfolio Management</h2>
      <ul>
        {portfolio.map((asset, index) => (
          <li key={index}>
            {asset.token}: {asset.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioManagement;
