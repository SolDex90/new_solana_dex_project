import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Backtest from './Backtest';
import LivePrices from './LivePrices';
import LimitOrder from './LimitOrder';
import Staking from './Staking';
import PortfolioAnalytics from './PortfolioAnalytics';
import LiquidityPools from './LiquidityPools';
import PaperTrading from './PaperTrading'; // Import PaperTrading

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TradingDashboard = () => {
  const [data, setData] = useState([]);
  const [portfolio, setPortfolio] = useState([
    { name: 'BTC', value: 1000, gain: 100, amount: 0.02 },
    { name: 'ETH', value: 500, gain: 50, amount: 0.5 }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const mockData = [
        { date: '2024-01-01', price: 100 },
        { date: '2024-01-02', price: 110 },
        { date: '2024-01-03', price: 105 },
      ];
      setData(mockData);
    };

    fetchData();
  }, []);

  const calculateMovingAverage = (data, windowSize) => {
    let averages = [];
    for (let i = 0; i < data.length; i++) {
      if (i < windowSize - 1) {
        averages.push(null);
        continue;
      }
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += data[i - j].price;
      }
      averages.push(sum / windowSize);
    }
    return averages;
  };

  const movingAverage = calculateMovingAverage(data, 3);

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Price',
        data: data.map(d => d.price),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: '3-Day Moving Average',
        data: movingAverage,
        fill: false,
        backgroundColor: 'rgb(192, 75, 192)',
        borderColor: 'rgba(192, 75, 192, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Trading Dashboard',
      },
    },
  };

  return (
    <div>
      <h2>Trading Dashboard</h2>
      <Line data={chartData} options={options} />
      <LivePrices tokenIds={['bitcoin', 'ethereum', 'solana']} />
      <Backtest />
      <LimitOrder />
      <Staking />
      <PortfolioAnalytics portfolio={portfolio} />
      <LiquidityPools />
      <PaperTrading /> {/* Add PaperTrading component */}
    </div>
  );
};

export default TradingDashboard;
