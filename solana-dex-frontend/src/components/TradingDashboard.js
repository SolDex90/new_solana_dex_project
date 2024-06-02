// src/components/TradingDashboard.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Backtest from './Backtest';
import LimitOrder from './LimitOrder';
import Staking from './Staking';
import PortfolioAnalytics from './PortfolioAnalytics';
import LiquidityPools from './LiquidityPools';
import PaperTrading from './PaperTrading';
import OrderBook from './OrderBook';
import MarketOverview from './MarketOverview';
import Alerts from './Alerts';
import Chat from './Chat';
import Tutorials from './Tutorials';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TradingDashboard = () => {
  const [data, setData] = useState([]);
  const [portfolio] = useState([
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
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Trading Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <Line data={chartData} options={options} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Backtest />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <LimitOrder />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Staking />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <PortfolioAnalytics portfolio={portfolio} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <LiquidityPools />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <PaperTrading />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <OrderBook pair="BTC/USD" />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <MarketOverview />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Alerts />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Chat />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Tutorials />
      </div>
    </div>
  );
};

export default TradingDashboard;
