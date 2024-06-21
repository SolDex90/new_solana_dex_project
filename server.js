const express = require('express');
const cors = require('cors');
const { combineAndDeduplicateData } = require('./services/tokenService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Ensure JSON parsing is enabled

app.get('/api/tokens', async (req, res) => {
  try {
    const tokens = await combineAndDeduplicateData();
    res.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

// Add the /api/swap endpoint
app.post('/api/swap', async (req, res) => {
  try {
    const { fromToken, toToken, fromAmount, toAmount, slippage } = req.body;

    // Assuming you have a performSwap function that handles the swap logic
    const swapResult = await performSwap(fromToken, toToken, fromAmount, toAmount, slippage);

    res.json({ message: 'Swap successful', swapResult });
  } catch (error) {
    console.error('Error during swap:', error);
    res.status(500).json({ error: 'Swap failed' });
  }
});

// Add the root handler
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
