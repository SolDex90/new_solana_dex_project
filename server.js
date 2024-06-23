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

// Define performSwap function
const performSwap = async (fromToken, toToken, fromAmount, toAmount, slippage) => {
  try {
    // Simulate a successful swap logic for demonstration purposes
    const swapResult = {
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      slippage,
      timestamp: new Date(),
    };
    // Add your actual swap logic here, e.g., interacting with a smart contract
    return swapResult;
  } catch (error) {
    console.error('Error in performSwap:', error); // Detailed logging
    throw new Error('Swap execution failed');
  }
};

// Add the /api/swap endpoint
app.post('/api/swap', async (req, res) => {
  try {
    const { fromToken, toToken, fromAmount, toAmount, slippage } = req.body;

    const swapResult = await performSwap(fromToken, toToken, fromAmount, toAmount, slippage);

    res.json({ message: 'Swap successful', swapResult });
  } catch (error) {
    console.error('Error during swap:', error); // Detailed logging
    res.status(500).json({ error: 'Swap failed', details: error.message });
  }
});

// Add the root handler
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
