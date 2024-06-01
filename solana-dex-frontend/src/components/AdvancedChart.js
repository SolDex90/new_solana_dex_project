import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdvancedChart = ({ data, options }) => {
  return (
    <div>
      <h2>Advanced Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default AdvancedChart;
