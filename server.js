const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello, world!' });
});

// Define the chart-data endpoint
app.get('/api/chart-data', (req, res) => {
  const chartData = [
    { date: '2024-01-01', price: 100 },
    { date: '2024-01-02', price: 110 },
    { date: '2024-01-03', price: 105 },
  ];
  res.json(chartData);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
