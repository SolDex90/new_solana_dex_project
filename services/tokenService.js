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

// Use the correct Jupiter Price API endpoint
async function fetchFromJupiter() {
  return fetchWithRetry('https://price.jup.ag/v6/price?ids=SOL');
}

// Use the new BirdEye API endpoint with authentication
async function fetchFromBirdeye() {
  const apiKey = '7707fff5284b4debbdc6487845ea9218'; // Replace with your actual API key
  const headers = {
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json'
  };
  return fetchWithRetry('https://public-api.birdeye.so/defi/tokenlist', { headers });
}

async function fetchFromSolanaBlockchain() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  // Implement logic to fetch tokens directly from Solana blockchain
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

  // Convert Jupiter tokens from object to array
  const jupiterTokensArray = Object.values(jupiterTokens.data).map(token => ({
    address: token.id,
    symbol: token.mintSymbol,
    price: token.price
  }));

  const birdEyeTokensArray = birdeyeTokens.data.tokens.map(token => ({
    address: token.address,
    symbol: token.symbol,
    price: token.liquidity // Assuming using liquidity as a proxy for price
  }));

  const allTokens = [...jupiterTokensArray, ...birdEyeTokensArray, ...blockchainTokens];

  const uniqueTokens = allTokens.reduce((acc, token) => {
    if (!acc.find(t => t.address === token.address)) {
      acc.push(token);
    }
    return acc;
  }, []);

  return uniqueTokens;
}

module.exports = { combineAndDeduplicateData };
