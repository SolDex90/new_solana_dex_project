import React from 'react';
import PortfolioComponent from '../components/Portfolio'; // Renamed to avoid conflict
import PortfolioAnalytics from '../components/PortfolioAnalytics';
import Staking from '../components/Staking';
import LiquidityPools from '../components/LiquidityPools';
import TradingHistory from '../components/TradingHistory';

const Portfolio = () => {
  return (
    <main style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>User Portfolio</h2>
      <div style={{ marginBottom: '20px' }}>
        <PortfolioComponent />
      </div>
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

export default Portfolio;
