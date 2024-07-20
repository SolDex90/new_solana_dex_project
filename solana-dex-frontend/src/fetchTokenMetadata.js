import axios from 'axios';

// Ensure the environment variables are loaded
require('dotenv').config();

export const fetchTokenMetadata = async () => {
  try {
    const apiKey = process.env.REACT_APP_BIRDEYE_API_KEY; // Fetching API key from environment variable
    const headers = {
      'X-API-KEY': apiKey,
      'x-chain': 'solana'
    };

    const response = await axios.get('https://public-api.birdeye.so/defi/tokenlist', { headers });

    if (response.data.success) {
      return response.data.data.tokens;
    } else {
      throw new Error('Failed to fetch token metadata');
    }
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return [];
  }
};
