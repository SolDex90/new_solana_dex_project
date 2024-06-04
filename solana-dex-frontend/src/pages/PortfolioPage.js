import React from 'react';
import PortfolioOverview from '../components/PortfolioOverview';
import AssetList from '../components/AssetList';
import PortfolioPerformance from '../components/PortfolioPerformance';
import PortfolioComponent from '../components/PortfolioComponent'; // Renamed to avoid conflict
import PortfolioAnalytics from '../components/PortfolioAnalytics';
import Staking from '../components/Staking';
import LiquidityPools from '../components/LiquidityPools';
import TradingHistory from '../components/TradingHistory';
import Watchlist from '../components/Watchlist';

const PortfolioPage = () => {
  return (
    <main style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>User Portfolio</h2>
      <div style={{ marginBottom: '20px' }}>
        <PortfolioOverview />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <AssetList />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <PortfolioPerformance />
      </div>
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
      <div style={{ marginBottom: '20px' }}>
        <Watchlist />
      </div>
    </main>
  );
};

export default PortfolioPage;
