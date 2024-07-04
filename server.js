require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Keypair } = require('@solana/web3.js');
const { combineAndDeduplicateData, placeLimitOrder, placeDCAOrder, placePerpsOrder } = require('./services/tokenService');

// Load keypair from environment variables
let keypairData;
try {
    keypairData = JSON.parse(process.env.MY_DEX_PROJECT_PRIVATE_KEY);
} catch (error) {
    console.error('Invalid JSON format for MY_DEX_PROJECT_PRIVATE_KEY:', error.message);
    process.exit(1);
}

const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/tokens', async (req, res) => {
  try {
    const tokens = await combineAndDeduplicateData();
    res.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

const performSwap = async (fromToken, toToken, fromAmount, toAmount, slippage) => {
  try {
    const swapResult = {
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      slippage,
      timestamp: new Date(),
    };
    return swapResult;
  } catch (error) {
    console.error('Error in performSwap:', error);
    throw new Error('Swap execution failed');
  }
};

app.post('/api/swap', async (req, res) => {
  try {
    const { fromToken, toToken, fromAmount, toAmount, slippage } = req.body;

    const swapResult = await performSwap(fromToken, toToken, fromAmount, toAmount, slippage);

    res.json({ message: 'Swap successful', swapResult });
  } catch (error) {
    console.error('Error during swap:', error);
    res.status(500).json({ error: 'Swap failed', details: error.message });
  }
});

app.post('/api/limit-order', async (req, res) => {
  try {
    const { fromToken, toToken, price, amount } = req.body;

    const orderResult = await placeLimitOrder(fromToken, toToken, price, amount);

    res.json({ message: 'Limit order placed successfully', orderResult });
  } catch (error) {
    console.error('Error placing limit order:', error);
    res.status(500).json({ error: 'Failed to place limit order', details: error.message });
  }
});

app.post('/api/dca-order', async (req, res) => {
  try {
    const { fromToken, toToken, amount, frequency, interval, numOrders } = req.body;

    const orderResult = await placeDCAOrder(fromToken, toToken, amount, frequency, interval, numOrders);

    res.json({ message: 'DCA order placed successfully', orderResult });
  } catch (error) {
    console.error('Error placing DCA order:', error);
    res.status(500).json({ error: 'Failed to place DCA order', details: error.message });
  }
});

app.post('/api/perps-order', async (req, res) => {
  try {
    const { fromToken, toToken, price, amount, position, leverage } = req.body;

    const orderResult = await placePerpsOrder(fromToken, toToken, price, amount, position, leverage);

    res.json({ message: 'Perps order placed successfully', orderResult });
  } catch (error) {
    console.error('Error placing Perps order:', error);
    res.status(500).json({ error: 'Failed to place Perps order', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
