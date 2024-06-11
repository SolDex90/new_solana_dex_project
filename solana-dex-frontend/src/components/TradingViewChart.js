import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart } from 'lightweight-charts';

const TradingViewChart = ({ data, setSellPrice }) => {
  const chartContainerRef = useRef(null);
  const [chartType, setChartType] = useState('line');
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [hoveredTime, setHoveredTime] = useState(null);
  const horizontalLinesRef = useRef([]);

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

      // Add series to chart
      updateSeries();

      // Set up the hover event
      chartRef.current.subscribeCrosshairMove((param) => {
        if (!param || !param.time) {
          setHoveredTime(null);
          return;
        }

        setHoveredTime(param.time);
      });

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
  }, [updateSeries, handleChartClick]);

  useEffect(() => {
    // Update the series data when the data changes
    updateSeriesData(data);
  }, [data, updateSeriesData]);

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === 'line' ? 'candlestick' : 'line'));
  };

  const formatTime = (time) => {
    const date = new Date(time * 1000);
    return date.toLocaleString();
  };

  return (
    <div>
      <button onClick={toggleChartType}>
        Toggle to {chartType === 'line' ? 'Candlestick' : 'Line'} Chart
      </button>
      <div ref={chartContainerRef} />
      {hoveredTime && <div className="hovered-time">Time: {formatTime(hoveredTime)}</div>}
    </div>
  );
};

export default TradingViewChart;
