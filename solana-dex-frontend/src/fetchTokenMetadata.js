import axios from 'axios';

export const fetchTokenMetadata = async () => {
  try {
    const apiKey = '7707fff5284b4debbdc6487845ea9218';
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
