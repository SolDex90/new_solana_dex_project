import React from 'react';
import AdvancedChart from './AdvancedChart';

const AnalyticsDashboard = () => {
  // Sample data for the dashboard
  const portfolioData = [
    { date: '2024-01-01', value: 10000 },
    { date: '2024-01-02', value: 10500 },
    { date: '2024-01-03', value: 10250 },
  ];

  const marketTrendsData = [
    { date: '2024-01-01', trend: 1.2 },
    { date: '2024-01-02', trend: 1.3 },
    { date: '2024-01-03', trend: 1.1 },
  ];

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <h3>Portfolio Performance</h3>
      <AdvancedChart data={portfolioData} dataKey="value" />
      <h3>Market Trends</h3>
      <AdvancedChart data={marketTrendsData} dataKey="trend" />
    </div>
  );
};

export default AnalyticsDashboard;
