import React from 'react';

const AssetList = () => {
  // Fetch and display detailed list of assets
  return (
    <div className="card">
      <h3>Asset List</h3>
      <ul>
        <li>Bitcoin: 0.5 BTC ($500.00)</li>
        <li>Ethereum: 1.5 ETH ($450.00)</li>
        {/* List other assets */}
      </ul>
    </div>
  );
};

export default AssetList;
