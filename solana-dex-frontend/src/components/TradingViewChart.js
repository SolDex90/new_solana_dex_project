import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const TradingViewChart = ({ data }) => {
  const chartContainerRef = useRef(null);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    console.log('Chart data:', data); // Log data for debugging
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, { width: 600, height: 400 });
      let series;

      if (chartType === 'line') {
        series = chart.addLineSeries();
        const lineData = data.map(item => ({ time: item.time, value: item.value }));
        console.log('Line chart data:', lineData[0]); // Log a single data point for debugging
        series.setData(lineData);
      } else if (chartType === 'candlestick') {
        series = chart.addCandlestickSeries();
        const candlestickData = data.map(item => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));
        console.log('Candlestick chart data:', candlestickData[0]); // Log a single data point for debugging
        series.setData(candlestickData);
      }

      return () => {
        chart.removeSeries(series);
        chart.remove();
      };
    }
  }, [data, chartType]);

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === 'line' ? 'candlestick' : 'line'));
  };

  return (
    <div>
      <button onClick={toggleChartType}>
        Toggle to {chartType === 'line' ? 'Candlestick' : 'Line'} Chart
      </button>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default TradingViewChart;
