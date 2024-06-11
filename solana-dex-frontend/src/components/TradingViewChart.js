import React, { useEffect, useRef, useCallback } from 'react';
import { createChart } from 'lightweight-charts';

const TradingViewChart = ({ data, setSellPrice }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const horizontalLinesRef = useRef([]);

  const updateSeriesData = useCallback((data) => {
    if (seriesRef.current) {
      const candlestickData = data.map(item => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));
      seriesRef.current.setData(candlestickData);
    }
  }, []);

  const handleChartClick = useCallback((param) => {
    if (!chartRef.current || !param || !param.point) return;
    
    const price = seriesRef.current.coordinateToPrice(param.point.y);
    if (price !== undefined) {
      setSellPrice(price);

      // Remove previous lines
      horizontalLinesRef.current.forEach(line => {
        if (line) {
          chartRef.current.removeSeries(line);
        }
      });
      horizontalLinesRef.current = [];

      // Add horizontal line
      const lineSeries = chartRef.current.addLineSeries({
        color: 'red',
        lineWidth: 1,
      });
      lineSeries.setData([{ time: data[0].time, value: price }, { time: data[data.length - 1].time, value: price }]);
      horizontalLinesRef.current.push(lineSeries);
    }
  }, [data, setSellPrice]);

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

      // Add candlestick series to chart
      seriesRef.current = chartRef.current.addCandlestickSeries();
      updateSeriesData(data);

      // Set up the click event
      chartRef.current.subscribeClick(handleChartClick);
    }

    // Cleanup function to remove the chart
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [updateSeriesData, handleChartClick, data]);

  useEffect(() => {
    // Update the series data when the data changes
    updateSeriesData(data);
  }, [data, updateSeriesData]);

  return (
    <div>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default TradingViewChart;
