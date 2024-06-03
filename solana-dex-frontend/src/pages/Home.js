import React, { useState, useEffect } from 'react';
import RealTimeData from '../components/RealTimeData';
import Portfolio from '../components/Portfolio';
import TokenChart from '../components/TokenChart';
import PortfolioAnalytics from '../components/PortfolioAnalytics';
import Staking from '../components/Staking';
import LiquidityPools from '../components/LiquidityPools';
import { fetchData } from '../utils/apiService';

const Home = () => {
  const [chartData, setChartData] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await fetchData('api/chart-data');  // Ensure this endpoint exists on the server
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    const fetchMessage = async () => {
      try {
        const data = await fetchData('api/hello');
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    fetchChartData();
    fetchMessage();
  }, []);

  return (
    <main>
      <h2>Home Page</h2>
      <p>{message}</p> {/* Display the message from the API */}
      <p>Welcome to the Solana DEX!</p>
      <RealTimeData />
      {/* <Portfolio /> */}
      {/* <PortfolioAnalytics /> */}
      {/* <Staking /> */}
      {/* <LiquidityPools /> */}
      <TokenChart data={chartData} />
    </main>
  );
};

export default Home;
