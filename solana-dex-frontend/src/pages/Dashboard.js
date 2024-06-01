import React from 'react';
import Portfolio from '../components/Portfolio';
import PortfolioAnalytics from '../components/PortfolioAnalytics';
import Staking from '../components/Staking';
import LiquidityPools from '../components/LiquidityPools';
import TradingHistory from '../components/TradingHistory';

const Dashboard = () => {
  return (
    <main>
      <h2>User Dashboard</h2>
      <Portfolio />
      <PortfolioAnalytics />
      <Staking />
      <LiquidityPools />
      <TradingHistory />
    </main>
  );
};

export default Dashboard;
