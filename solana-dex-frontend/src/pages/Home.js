import React, { useState, useEffect } from 'react';
import RealTimeData from '../components/RealTimeData';
import Portfolio from '../components/Portfolio';
import TokenChart from '../components/TokenChart';
import PortfolioAnalytics from '../components/PortfolioAnalytics';
import Staking from '../components/Staking';
import LiquidityPools from '../components/LiquidityPools';

const Home = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        { date: '2024-01-01', price: 100 },
        { date: '2024-01-02', price: 110 },
        { date: '2024-01-03', price: 105 },
      ];
      setChartData(data);
    };

    fetchData();
  }, []);

  return (
    <main>
      <h2>Home Page</h2>
      <p>Welcome to the Solana DEX!</p>
      <RealTimeData />
      <Portfolio />
      <PortfolioAnalytics />
      <Staking />
      <LiquidityPools />
      <TokenChart data={chartData} />
    </main>
  );
};

export default Home;
