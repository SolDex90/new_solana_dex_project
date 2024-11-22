import React from 'react';
import PortfolioAnalytics from './PortfolioAnalytics';
import Staking from './Staking';
import LiquidityPools from './LiquidityPools';
import TradingHistory from './TradingHistory';

const PortfolioComponent = () => {
  return (
    <main style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>User Portfolio</h2>
      <div style={{ marginBottom: '20px' }}>
        <PortfolioAnalytics />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Staking />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <LiquidityPools />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <TradingHistory />
      </div>
    </main>
  );
};

export default PortfolioComponent;
