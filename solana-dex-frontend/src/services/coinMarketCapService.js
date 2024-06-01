import axios from 'axios';

const COINMARKETCAP_API_URL = 'https://pro-api.coinmarketcap.com/v1';
const API_KEY = '90abfb54-cf55-4d31-874d-09c2fc0f9664'; // Your CoinMarketCap API key

const axiosInstance = axios.create({
  baseURL: COINMARKETCAP_API_URL,
  headers: {
    'X-CMC_PRO_API_KEY': API_KEY,
  },
});

export const getCryptoPrices = async (symbols) => {
  try {
    const response = await axiosInstance.get('/cryptocurrency/quotes/latest', {
      params: {
        symbol: symbols.join(','),
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching cryptocurrency prices:', error);
    throw error;
  }
};
