import React from 'react';
import TradingDashLimitOrder from './TradingDashLimitOrder'; // Original import
import PaperTrading from './PaperTrading';

const TradingDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Trading Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <TradingDashLimitOrder /> {/* Original component name */}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <PaperTrading />
      </div>
    </div>
  );
};

export default TradingDashboard;
