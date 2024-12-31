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

async function fetchFromJupiter() {
  try {
    const response = await fetchWithRetry('https://tokens.jup.ag/tokens?tags=verified');
    const tokens = response;

    if (!Array.isArray(tokens)) {
      throw new Error('Invalid data from Jupiter API: Expected an array of tokens');
    }

    console.log('Jupiter Token Data:', tokens);
    return tokens;
  } catch (error) {
    console.error('Error fetching tokens from Jupiter API:', error);
    throw new Error('Failed to fetch tokens from Jupiter API');
  }
}

async function fetchFromSolanaBlockchain() {
  const connection = new Connection('https://api.devnet.solana.com');
  // Implement your logic to fetch tokens from the Solana blockchain
  const tokens = []; 
  return tokens;
}

async function combineAndDeduplicateData() {
  try {
    // Fetch tokens from Jupiter API
    const jupiterTokens = await fetchFromJupiter();
    console.log('Jupiter Tokens:', jupiterTokens);

    // Convert Jupiter tokens to a uniform format
    const jupiterTokensArray = jupiterTokens.map(token => ({
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      name: token.name,
      logoURI: token.logoURI,
      price: null // You can fetch the price separately if needed
    }));

    // Return the Jupiter tokens directly
    return jupiterTokensArray;
  } catch (error) {
    console.error('Error in combineAndDeduplicateData:', error);
    throw new Error('Failed to fetch and process tokens from Jupiter API');
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
