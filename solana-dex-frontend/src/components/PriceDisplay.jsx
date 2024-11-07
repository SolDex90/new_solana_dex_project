import React from 'react';

const PriceDisplay = ({ fromToken, toToken, prices }) => (
  <div className="price-chart">
    <div className="price-row">
      <span className="price-token">{fromToken}</span>
      <span className="price-value">{prices[fromToken] ? `$${prices[fromToken].toFixed(10)}` : 'N/A'}</span>
    </div>
    <div className="price-row">
      <span className="price-token">{toToken}</span>
      <span className="price-value">{prices[toToken] ? `$${prices[toToken].toFixed(10)}` : 'N/A'}</span>
    </div>
  </div>
);

export default PriceDisplay;
