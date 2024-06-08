import axios from 'axios';

export const fetchChartData = async (symbol) => {
  try {
    const response = await axios.get(`https://price.jup.ag/v6/price?ids=${symbol}`);
    const data = response.data;

    console.log('Fetched chart data:', data); // Log data for debugging

    if (!data.data || !data.data[symbol]) {
      throw new Error('Invalid data format received');
    }

    // Simulate historical price data for the sake of example
    const prices = [];
    const timestamps = [];
    for (let i = 0; i < 24; i++) { // Simulate 24 hours of data
      prices.push(data.data[symbol].price * (1 + (Math.random() - 0.5) * 0.1)); // Simulate price changes
      timestamps.push(new Date(Date.now() - i * 3600000)); // Each hour
    }

    return { prices: prices.reverse(), timestamps: timestamps.reverse() }; // Reverse to get chronological order
  } catch (error) {
    console.error(`Error fetching chart data for ${symbol}:`, error);
    return { prices: [], timestamps: [] };
  }
};
