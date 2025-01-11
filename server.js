require('dotenv').config();

const {MongoClient} = require('mongodb');
const express = require('express');
const cors = require('cors');
const { Keypair, PublicKey } = require('@solana/web3.js');
const { combineAndDeduplicateData,  placePerpsOrder } = require('./services/tokenService');
const axios = require('axios');

// Load keypair from environment variables
let keypairData;
try {
    keypairData = JSON.parse(process.env.MY_DEX_PROJECT_PRIVATE_KEY);
} catch (error) {
    //console.error('Invalid JSON format for MY_DEX_PROJECT_PRIVATE_KEY:', error.message);
    process.exit(1);
}

const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
const app = express();
const PORT = process.env.PORT || 3000;

const SUPPORTED_FEE_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  // Add more tokens as needed
};

const fetchMintAddressFromJupiter = async (symbol) => {
  try {
    const response = await axios.get('https://tokens.jup.ag/tokens?tags=verified');
    const token = response.data.find(t => t.symbol === symbol);

    if (!token) {
      throw new Error(`Token ${symbol} not found in Jupiter API`);
    }

    return { address: token.address, decimal: token.decimals };
  } catch (error) {
    console.error('Error fetching token from Jupiter API:', error);
    throw new Error('Failed to fetch token from Jupiter API');
  }
};


app.use(cors());
app.use(express.json());

app.get('/api/tokens', async (req, res) => {
  try {
    const tokens = await combineAndDeduplicateData();
    res.json(tokens);
  } catch (error) {
    //console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

const performSwap = async (fromToken, toToken, decimals, fromAmount, toAmount, slippage, walletAddress, platformFeeBps) => {
  try {
    const inputMint = fromToken;
    const decimal = decimals;
    const outputMint = toToken;

    const amountInSmallestUnit = Math.round(fromAmount * Math.pow(10, decimal));

    // Initial quote request without fee parameters
    const quoteResponse = await axios.get(process.env.JUPITER_SWAP_QUOTE_API_URL, {
      params: {
        inputMint: inputMint,
        outputMint: outputMint,
        amount: amountInSmallestUnit,
        slippageBps: slippage * 100,
      }
    });

    const quoteRes = quoteResponse.data;

    // Check if we can take fees based on the trading pair and swap mode
    const canTakeFees = await determineFeePossibility(inputMint, outputMint, quoteRes.swapMode);

    if (!canTakeFees.canTakeFee) {
      console.log('Proceeding without fees:', canTakeFees.reason);
      // Perform swap without fee parameters
      const swapTransaction = await axios.post(process.env.JUPITER_SWAP_API_URL, {
        quoteResponse: quoteRes,
        userPublicKey: walletAddress,
        wrapAndUnwrapSol: true,
        useSharedAccounts: true
      });

      return swapTransaction.data.swapTransaction;
    }

    // If we can take fees, determine which token to use
    const feeMint = canTakeFees.feeMint;
    console.log('Fee will be taken in:', feeMint);

    // Calculate fee account
    let feeAccount;
    try {
      const referralPubkey = new PublicKey(process.env.REFERRAL_ACCOUNT_PUBKEY);
      const feeMintPubkey = new PublicKey(feeMint);
      
      [feeAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("referral_ata"),
          referralPubkey.toBuffer(),
          feeMintPubkey.toBuffer(),
        ],
        new PublicKey("REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3")
      );
    } catch (error) {
      console.error('Error creating fee account:', error);
      // If fee account creation fails, proceed without fees
      const swapTransaction = await axios.post(process.env.JUPITER_SWAP_API_URL, {
        quoteResponse: quoteRes,
        userPublicKey: walletAddress,
        wrapAndUnwrapSol: true,
        useSharedAccounts: true
      });
      return swapTransaction.data.swapTransaction;
    }

    // Get new quote with fee parameters
    const quoteWithFeeResponse = await axios.get(process.env.JUPITER_SWAP_QUOTE_API_URL, {
      params: {
        inputMint: inputMint,
        outputMint: outputMint,
        amount: amountInSmallestUnit,
        slippageBps: slippage * 100,
        platformFeeBps: platformFeeBps,
      }
    });

    // Perform the swap with fee parameters
    const swapTransaction = await axios.post(process.env.JUPITER_SWAP_API_URL, {
      quoteResponse: quoteWithFeeResponse.data,
      userPublicKey: walletAddress,
      wrapAndUnwrapSol: true,
      feeAccount: feeAccount.toBase58()
    });

    return swapTransaction.data.swapTransaction;
  } catch (error) {
    console.error('Error in performSwap:', error);
    throw new Error(`Swap execution failed: ${error.message}`);
  }
};

app.post('/api/swap', async (req, res) => {
  try {
    const { fromToken, toToken, decimals, fromAmount, toAmount, slippage, walletAddress, platformFeeBps } = req.body;

    if (!fromToken || !toToken || !fromAmount || !decimals || !toAmount || !slippage || !walletAddress || !platformFeeBps) {
      return res.status(400).json({ message: 'Invalid input parameters' });
    }

    const swapResult = await performSwap(fromToken, toToken, decimals, fromAmount, toAmount, slippage, walletAddress, platformFeeBps);

    res.json({ message: 'Swap successful', swapResult });
  } catch (error) {
    console.error('Error during swap:', error);
    res.status(500).json({ error: 'Swap failed', details: error.message });
  }
});

async function placeLimitOrder(fromToken, toToken, price, FromTokenAmount, walletAddress, ToTokenAmount, sendingBase, platformFeeBps) {
  try {
    // Fetch mint addresses and decimals for the tokens
    const fromTokenData = await fetchMintAddressFromJupiter(fromToken);
    const fromMint = fromTokenData.address;
    const fromDecimal = fromTokenData.decimal;

    const toTokenData = await fetchMintAddressFromJupiter(toToken);
    const toMint = toTokenData.address;
    const toDecimal = toTokenData.decimal;

    // Calculate amounts in smallest units
    const makingAmount = Math.round(FromTokenAmount * Math.pow(10, fromDecimal));
    const takingAmount = Math.round(ToTokenAmount * Math.pow(10, toDecimal));

    // Check if we can take fees based on the trading pair
    const canTakeFees = await determineFeePossibility(fromMint, toMint, 'ExactIn');

    // Base order structure
    let createOrderBody = {
      inputMint: fromMint,
      outputMint: toMint,
      maker: walletAddress,
      payer: walletAddress,
      params: {
        makingAmount: makingAmount.toString(),
        takingAmount: takingAmount.toString()
      },
      computeUnitPrice: "auto",
      wrapAndUnwrapSol: true
    };

    // Add feeBps and referral if supported
    if (canTakeFees.canTakeFee && process.env.REFERRAL_ACCOUNT_PUBKEY) {
      // Create fee account
      let feeAccount;
      try {
        const referralPubkey = new PublicKey(process.env.REFERRAL_ACCOUNT_PUBKEY);
        const feeMintPubkey = new PublicKey(canTakeFees.feeMint);

        [feeAccount] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("referral_ata"),
            referralPubkey.toBuffer(),
            feeMintPubkey.toBuffer(),
          ],
          new PublicKey("REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3")
        );

        // Add feeBps to params
        createOrderBody.params.feeBps = platformFeeBps.toString();

        // Use the fee account as the referral
        createOrderBody.referral = feeAccount.toBase58();
      } catch (error) {
        console.error('Error creating fee account:', error);
        // If fee account creation fails, proceed without fees
        delete createOrderBody.params.feeBps;
        delete createOrderBody.referral;
      }
    }

    // Send request to Jupiter Limit Order v2 API
    const response = await axios.post(
      `${process.env.JUPITER_LIMIT_ORDER_API_URL}createOrder`,
      createOrderBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in placeLimitOrder:', error.response?.data || error);
    throw new Error(`Limit order placement failed: ${error.response?.data?.message || error.message}`);
  }
}

app.post('/api/limit-order-history', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    const openOrdersResponse = await axios.get(`https://api.jup.ag/limit/v2/openOrders?wallet=${walletAddress}`);
    const orderHistoryResponse = await axios.get(`https://api.jup.ag/limit/v2/orderHistory?wallet=${walletAddress}`);

    const fetchResult = {
      openOrders: openOrdersResponse.data,
      orderHistory: orderHistoryResponse.data,
    };

    res.json({ message: 'Open order fetched successfully', fetchResult });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: 'Failed to fetch order history', details: error.message });
  }
});

app.post('/api/limit-order', async (req, res) => {
  try {
    const { fromToken, toToken, price, amount, walletAddress, totalUSDC, sendingBase, platformFeeBps } = req.body;

    const orderResult = await placeLimitOrder(fromToken, toToken, price, amount, walletAddress, totalUSDC, sendingBase, platformFeeBps);

    res.json({ message: 'Limit order placed successfully', orderResult });
  } catch (error) {
    console.error('Error placing limit order:', error);
    res.status(500).json({ error: 'Failed to place limit order', details: error.message });
  }
});

async function placeDCAOrder(fromToken, toToken) {
  try {
    const fromTokenData = await fetchMintAddressFromJupiter(fromToken);
    const toTokenData = await fetchMintAddressFromJupiter(toToken);

    return {
      inputMint: fromTokenData.address,
      inputDecimal: fromTokenData.decimal,
      outputMint: toTokenData.address,
      outputDecimal: toTokenData.decimal,
    };
  } catch (error) {
    console.error('Error in placeDCAOrder:', error);
    throw new Error('DCA order placement failed');
  }
}

app.post('/api/dca-order', async (req, res) => {
  try {
    const { fromToken, toToken } = req.body;

    const orderData = await placeDCAOrder(fromToken, toToken);

    res.json({
      message: 'DCA order data fetched successfully',
      orderResult: orderData,
    });
  } catch (error) {
    console.error('Error fetching DCA order data:', error);
    res.status(500).json({ error: 'Failed to fetch DCA order data', details: error.message });
  }
});

app.post('/api/perps-order', async (req, res) => {
  try {
    const { fromToken, toToken, price, amount, position, leverage } = req.body;

    const orderResult = await placePerpsOrder(fromToken, toToken, price, amount, position, leverage);
    
    res.json({ message: 'Perps order placed successfully', orderResult });
  } catch (error) {
    ////console.error('Error placing Perps order:', error);
    res.status(500).json({ error: 'Failed to place Perps order', details: error.message });
  }
});

// app.get('/api/all-tokens', async (req, res) => {
//   const veriviedTokens = await getMintAddress()
// });

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  //console.log(`Server running at http://localhost:${PORT}`);
});

// Helper function to determine if we can take fees and which token to use
const determineFeePossibility = async (inputMint, outputMint, swapMode) => {
  // Check if either input or output mint is in our supported list
  const isInputSupported = Object.values(SUPPORTED_FEE_TOKENS).includes(inputMint);
  const isOutputSupported = Object.values(SUPPORTED_FEE_TOKENS).includes(outputMint);

  if (!isInputSupported && !isOutputSupported) {
    return {
      canTakeFee: false,
      reason: 'Neither token is in supported fee token list'
    };
  }

  // For ExactIn swaps, we can use either input or output mint
  if (swapMode === 'ExactIn') {
    // Prefer output token if supported, otherwise use input token
    if (isOutputSupported) {
      return {
        canTakeFee: true,
        feeMint: outputMint
      };
    } else if (isInputSupported) {
      return {
        canTakeFee: true,
        feeMint: inputMint
      };
    }
  }
  // For ExactOut swaps, we must use input mint
  else if (swapMode === 'ExactOut') {
    if (isInputSupported) {
      return {
        canTakeFee: true,
        feeMint: inputMint
      };
    } else {
      return {
        canTakeFee: false,
        reason: 'ExactOut swap but input token not supported for fees'
      };
    }
  }

  return {
    canTakeFee: false,
    reason: 'Unknown swap mode or unsupported configuration'
  };
};

