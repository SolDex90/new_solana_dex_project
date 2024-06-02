import React from 'react';
import Portfolio from '../components/Portfolio';
import PortfolioAnalytics from '../components/PortfolioAnalytics';
import Staking from '../components/Staking';
import LiquidityPools from '../components/LiquidityPools';
import TradingHistory from '../components/TradingHistory';

const Dashboard = () => {
  return (
    <main style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>User Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <Portfolio />
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

export default Dashboard;
