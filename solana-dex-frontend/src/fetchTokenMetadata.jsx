import axios from 'axios';

export const fetchTokenMetadata = async () => {
  try {
    const apiKey = import.meta.env.VITE_APP_BIRDEYE_API_KEY;
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
