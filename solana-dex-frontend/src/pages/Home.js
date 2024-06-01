import React, { useState, useEffect } from 'react';
import RealTimeData from '../components/RealTimeData';
import Portfolio from '../components/Portfolio';
import TokenChart from '../components/TokenChart';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
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
      <h2>{t('welcome')}</h2>
      <RealTimeData />
      <Portfolio />
      <TokenChart data={chartData} />
    </main>
  );
};

export default Home;
