import React from 'react';
import LimitOrder from './LimitOrder';
import PaperTrading from './PaperTrading';

const TradingDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Trading Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <LimitOrder />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <PaperTrading />
      </div>
    </div>
  );
};

export default TradingDashboard;
