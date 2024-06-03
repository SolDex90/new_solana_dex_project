import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, Tooltip, Legend } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
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

ChartJS.register(CategoryScale, LinearScale, TimeScale, Tooltip, Legend, CandlestickController, CandlestickElement);

const TradingDashboard = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  const [portfolio] = useState([
    { name: 'BTC', value: 1000, gain: 100, amount: 0.02 },
    { name: 'ETH', value: 500, gain: 50, amount: 0.5 }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const mockData = [
        { t: new Date('2024-01-01').getTime(), o: 100, h: 110, l: 90, c: 105 },
        { t: new Date('2024-01-02').getTime(), o: 105, h: 115, l: 95, c: 100 },
        { t: new Date('2024-01-03').getTime(), o: 100, h: 110, l: 85, c: 90 },
      ];
      setData(mockData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Capture the current chart reference inside the effect
    const currentChartRef = chartRef.current;

    return () => {
      // Destroy the chart instance to avoid canvas reuse issues
      if (currentChartRef) {
        currentChartRef.destroy();
      }
    };
  }, []);

  const chartData = {
    datasets: [
      {
        label: 'Candlestick',
        data: data,
        type: 'candlestick',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
        },
      },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Trading Dashboard</h2>
      <div style={{ marginBottom: '20px', maxWidth: '600px', height: '400px', margin: 'auto' }}>
        <Chart ref={chartRef} type='candlestick' data={chartData} options={options} />
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
