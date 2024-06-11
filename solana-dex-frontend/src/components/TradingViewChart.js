import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart } from 'lightweight-charts';

const TradingViewChart = ({ data }) => {
  const chartContainerRef = useRef(null);
  const [chartType, setChartType] = useState('line');
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const updateSeriesData = useCallback((data) => {
    if (seriesRef.current) {
      if (chartType === 'line') {
        const lineData = data.map(item => ({ time: item.time, value: item.close }));
        seriesRef.current.setData(lineData);
      } else if (chartType === 'candlestick') {
        const candlestickData = data.map(item => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));
        seriesRef.current.setData(candlestickData);
      }
    }
  }, [chartType]);

  const updateSeries = useCallback(() => {
    if (chartRef.current) {
      // Remove the existing series if it exists
      if (seriesRef.current) {
        chartRef.current.removeSeries(seriesRef.current);
      }

      // Add the new series based on the chart type
      if (chartType === 'line') {
        seriesRef.current = chartRef.current.addLineSeries();
      } else if (chartType === 'candlestick') {
        seriesRef.current = chartRef.current.addCandlestickSeries();
      }

      // Set the data for the new series
      updateSeriesData(data);
    }
  }, [chartType, updateSeriesData, data]);

  useEffect(() => {
    if (chartContainerRef.current) {
      // Create the chart if it doesn't exist
      chartRef.current = createChart(chartContainerRef.current, { width: 600, height: 400 });

      // Configure crosshair
      chartRef.current.applyOptions({
        crosshair: {
          mode: 0, // Normal mode
          vertLine: {
            width: 1,
            color: '#8b8b8b',
            style: 0,
            visible: true,
            labelVisible: true,
          },
          horzLine: {
            width: 1,
            color: '#8b8b8b',
            style: 0,
            visible: true,
            labelVisible: true,
          },
        },
      });

      // Add series to chart
      updateSeries();
    }

    // Cleanup function to remove the chart
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [updateSeries]);

  useEffect(() => {
    // Update the series data when the data changes
    updateSeriesData(data);
  }, [data, updateSeriesData]);

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
