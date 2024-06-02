// api/crypto.js
import axios from 'axios';

const COINMARKETCAP_API_URL = 'https://pro-api.coinmarketcap.com/v1';

export default async (req, res) => {
  try {
    const symbols = req.query.symbol;
    const response = await axios.get(`${COINMARKETCAP_API_URL}/cryptocurrency/quotes/latest`, {
      params: { symbol: symbols },
      headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY } // Use the environment variable
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching cryptocurrency prices:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
