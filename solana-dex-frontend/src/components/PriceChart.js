import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PriceChart = ({ data, labels }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time',
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price',
            }
          }
        }
      }
    });

    return () => {
      myChart.destroy();
    };
  }, [data, labels]);

  return (
    <div className="price-chart">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PriceChart;
