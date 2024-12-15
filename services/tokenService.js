const { Connection } = require('@solana/web3.js');
const { Token } = require('../models/mintTokenModel');
// const { getMinimumBalanceForRentExemptAccountWithExtensions } = require('@solana/spl-token'); 
// (Remove if unused)
const fetchModule = import('node-fetch');

async function fetchWithRetry(url, options = {}, retries = 3) {
  const fetch = (await fetchModule).default;
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

async function fetchFromBirdeye() {
  // Replace with your actual API key if required by BirdEye
  const apiKey = '7707fff5284b4debbdc6487845ea9218';
  const headers = {
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json'
  };
  
  const data = await fetchWithRetry('https://public-api.birdeye.so/defi/tokenlist', { headers });
  
  if (!data || !data.data || !Array.isArray(data.data.tokens)) {
    console.error('Invalid data from BirdEye API:', data);
    throw new Error('Failed to fetch valid data from BirdEye API');
  }
  
  console.log('BirdEye Data:', data);
  return data.data.tokens;
}

async function fetchFromSolanaBlockchain() {
  const connection = new Connection('https://api.devnet.solana.com');
  // Implement your logic to fetch tokens from the Solana blockchain
  const tokens = []; 
  return tokens;
}

async function combineAndDeduplicateData() {
  try {
    // Only fetching from BirdEye and blockchain now
    const birdEyeTokens = await fetchFromBirdeye();
    const blockchainTokens = await fetchFromSolanaBlockchain();

    console.log('BirdEye Tokens:', birdEyeTokens);
    console.log('Blockchain Tokens:', blockchainTokens);

    // Convert BirdEye tokens to a uniform format
    const birdEyeTokensArray = birdEyeTokens.map(token => ({
      address: token.address,
      symbol: token.symbol,
      price: token.price // Ensure this field is correct for price
    }));

    // Merge all tokens
    const allTokens = [...birdEyeTokensArray, ...blockchainTokens];

    // Deduplicate by address
    const uniqueTokens = allTokens.reduce((acc, token) => {
      if (!acc.find(t => t.address === token.address)) {
        acc.push(token);
      }
      return acc;
    }, []);

    return uniqueTokens;
  } catch (error) {
    console.error('Error in combineAndDeduplicateData:', error);
    throw new Error('Failed to combine and deduplicate data');
  }
}

// Define the placeDCAOrder function with necessary parameters
async function placeDCAOrder(fromToken, toToken, amount, frequency, interval, numOrders) {
  try {
    // Simulate the DCA order placement
    const dcaOrderResult = {
      fromToken,
      toToken,
      amount,
      frequency,
      interval,
      numOrders,
      timestamp: new Date(),
    };
    // Add actual DCA logic if needed
    return dcaOrderResult;
  } catch (error) {
    console.error('Error in placeDCAOrder:', error);
    throw new Error('DCA order placement failed');
  }
}

// Define the placePerpsOrder function with necessary parameters
async function placePerpsOrder(fromToken, toToken, price, amount, position, leverage) {
  try {
    const perpsOrderResult = {
      fromToken,
      toToken,
      price,
      amount,
      position,
      leverage,
      timestamp: new Date(),
    };
    // Add actual Perps order logic if needed
    return perpsOrderResult;
  } catch (error) {
    console.error('Error in placePerpsOrder:', error);
    throw new Error('Perps order placement failed');
  }
}

exports.getTokenBySymbol = async (symbol) => {
  return Token.findOne({ symbol });
};

module.exports = { combineAndDeduplicateData, placeDCAOrder, placePerpsOrder };
