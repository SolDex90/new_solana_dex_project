// src/services/coinMarketCapService.js
import axios from 'axios';

const COINMARKETCAP_API_URL = '/api'; // Serverless function endpoint

const axiosInstance = axios.create({
  baseURL: COINMARKETCAP_API_URL,
});

export const getCryptoPrices = async (symbols) => {
  try {
    const response = await axiosInstance.get('/cryptocurrency/quotes/latest', {
      params: {
        symbol: symbols.join(','),
      },
    });
    console.log('Request URL:', response.config.url); // Log the request URL
    return response.data.data;
  } catch (error) {
    console.error('Error fetching cryptocurrency prices:', error);
    throw error;
  }
};
