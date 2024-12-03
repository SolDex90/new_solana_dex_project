import React from 'react';

const PriceDisplay = ({ fromToken, toToken, prices }) => {
  return(
    <>
      <div className="price-chart">
        <div className="price-row">
          <span className="price-token">{fromToken}</span>
          {prices[fromToken] && <span className="price-value">{prices[fromToken] ? `$${parseFloat(prices[fromToken])}` : 'N/A'}</span>}
        </div>
        <div className="price-row">
          <span className="price-token">{toToken}</span>
          {prices[toToken] && <span className="price-value">{prices[toToken]  ? `$${parseFloat(prices[toToken])}` : 'N/A'}</span>}
        </div>
      </div>
    </>
  )
};

export default PriceDisplay;
