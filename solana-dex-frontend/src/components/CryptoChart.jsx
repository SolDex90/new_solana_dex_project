import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { fetchChartData } from '../fetchChartData'; // Adjust the path if necessary

function CryptoChart({ symbol }) {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://64.225.16.208:3000/api/tokens');
                const tokens = await response.json();
                const token = tokens.find(t => t.symbol === symbol);

                if (!token) {
                    console.error(`No data found for symbol: ${symbol}`);
                    return;
                }

                const chartData = await fetchChartData(symbol);

                const formattedData = {
                    labels: chartData.map(data => new Date(data.time)),
                    datasets: [{
                        label: `${symbol} Price`,
                        data: chartData.map(data => data.value),
                        borderColor: 'rgba(75,192,192,1)',
                        fill: false
                    }]
                };
                setChartData(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [symbol]);

    if (!chartData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Line
                data={chartData}
                options={{
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'minute'
                            }
                        },
                        y: {
                            beginAtZero: false
                        }
                    }
                }}
            />
        </div>
    );
}

export default CryptoChart;
