import axios from 'axios';
import { fetchTokenMetadata } from './fetchTokenMetadata';

export const fetchChartData = async (symbol) => {
  try {
    const tokens = await fetchTokenMetadata();
    const token = tokens.find(t => t.symbol === symbol);

    if (!token) {
      throw new Error(`Token with symbol ${symbol} not found`);
    }

    const apiKey = '7707fff5284b4debbdc6487845ea9218';
    const headers = {
      'X-API-KEY': apiKey,
      'x-chain': 'solana',
    };

    const tokenCreationTimestamp = Math.floor(new Date('2021-06-01T00:00:00Z').getTime() / 1000); // Example: June 1, 2021
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const response = await axios.get(
      `https://public-api.birdeye.so/defi/history_price?address=${token.address}&address_type=token&type=15m&time_from=${tokenCreationTimestamp}&time_to=${currentTimestamp}`, 
      { headers }
    );

    const data = response.data.data;

    console.log('Fetched chart data:', data); // Log data for debugging

    if (!data || !data.items || !data.items.length) {
      throw new Error('Invalid data format received');
    }

    const prices = data.items.map(item => {
      const value = item.value;
      // Simulating OHLC data
      const open = value * (1 + Math.random() * 0.02 - 0.01);
      const high = value * (1 + Math.random() * 0.04 - 0.02);
      const low = value * (1 + Math.random() * 0.04 - 0.02);
      const close = value * (1 + Math.random() * 0.02 - 0.01);
      return {
        time: item.unixTime,
        open,
        high,
        low,
        close
      };
    });

    console.log('Formatted chart data:', prices[0]); // Log a single data point for debugging

    return prices;
  } catch (error) {
    console.error(`Error fetching chart data for ${symbol}:`, error);
    return [];
  }
};
