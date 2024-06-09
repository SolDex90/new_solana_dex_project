import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const TradingViewChart = ({ data }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, { width: 600, height: 400 });
      const lineSeries = chart.addLineSeries();
      lineSeries.setData(data);

      return () => chart.remove();
    }
  }, [data]);

  return <div ref={chartContainerRef} />;
};

export default TradingViewChart;
