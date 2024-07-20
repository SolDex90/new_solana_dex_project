const { Connection } = require('@solana/web3.js');

async function fetchWithRetry(url, options = {}, retries = 3) {
  const fetch = (await import('node-fetch')).default;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Fetching ${url}`);
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log(`Successfully fetched data from ${url}`);
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        console.error(`Failed to fetch ${url} after ${retries} attempts:`, error);
        throw error;
      }
      console.log(`Retrying fetch ${url} (attempt ${attempt + 1})...`);
    }
  }
}

async function fetchFromJupiter() {
  const data = await fetchWithRetry('https://price.jup.ag/v6/price?ids=SOL,USDC,USDT');
  console.log('Jupiter Data:', data);
  return data;
}

async function fetchFromBirdeye() {
  const apiKey = process.env.REACT_APP_BIRDEYE_API_KEY; // Fetching API key from environment variable
  const headers = {
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json'
  };
  const data = await fetchWithRetry('https://public-api.birdeye.so/defi/tokenlist', { headers });
  console.log('BirdEye Data:', data);
  return data;
}

async function fetchFromSolanaBlockchain() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const tokens = []; // Replace with actual logic
  return tokens;
}

async function combineAndDeduplicateData() {
  const jupiterTokens = await fetchFromJupiter();
  const birdeyeTokens = await fetchFromBirdeye();
  const blockchainTokens = await fetchFromSolanaBlockchain();

  console.log('Jupiter Tokens:', jupiterTokens);
  console.log('BirdEye Tokens:', birdeyeTokens);
  console.log('Blockchain Tokens:', blockchainTokens);

  const jupiterTokensArray = Object.values(jupiterTokens.data).map(token => ({
    address: token.id,
    symbol: token.mintSymbol,
    price: token.price
  }));

  const birdEyeTokensArray = birdeyeTokens.data.tokens.map(token => ({
    address: token.address,
    symbol: token.symbol,
    price: token.price // Ensure this is the correct field for price
  }));

  console.log('USDC from Jupiter:', jupiterTokens.data.USDC);
  console.log('USDC from BirdEye:', birdeyeTokens.data.tokens.find(token => token.symbol === 'USDC'));

  const allTokens = [...jupiterTokensArray, ...birdEyeTokensArray, ...blockchainTokens];

  const uniqueTokens = allTokens.reduce((acc, token) => {
    if (!acc.find(t => t.address === token.address)) {
      acc.push(token);
    }
    return acc;
  }, []);

  return uniqueTokens;
}

// Define the placeLimitOrder function
async function placeLimitOrder(fromToken, toToken, price, amount) {
  try {
    // Simulate the limit order placement for demonstration purposes
    const limitOrderResult = {
      fromToken,
      toToken,
      price,
      amount,
      timestamp: new Date(),
    };
    // Add your actual limit order placement logic here
    return limitOrderResult;
  } catch (error) {
    console.error('Error in placeLimitOrder:', error);
    throw new Error('Limit order placement failed');
  }
}

// Define the placeDCAOrder function
async function placeDCAOrder(fromToken, toToken, amount, frequency, interval, numOrders) {
  try {
    // Simulate the DCA order placement for demonstration purposes
    const dcaOrderResult = {
      fromToken,
      toToken,
      amount,
      frequency,
      interval,
      numOrders,
      timestamp: new Date(),
    };
    // Add your actual DCA order placement logic here
    return dcaOrderResult;
  } catch (error) {
    console.error('Error in placeDCAOrder:', error);
    throw new Error('DCA order placement failed');
  }
}

// Define the placePerpsOrder function
async function placePerpsOrder(fromToken, toToken, price, amount, position, leverage) {
  try {
    // Simulate the Perps order placement for demonstration purposes
    const perpsOrderResult = {
      fromToken,
      toToken,
      price,
      amount,
      position,
      leverage,
      timestamp: new Date(),
    };
    // Add your actual Perps order placement logic here
    return perpsOrderResult;
  } catch (error) {
    console.error('Error in placePerpsOrder:', error);
    throw new Error('Perps order placement failed');
  }
}

module.exports = { combineAndDeduplicateData, placeLimitOrder, placeDCAOrder, placePerpsOrder };
