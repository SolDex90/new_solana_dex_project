require('dotenv').config();

const {MongoClient} = require('mongodb');
const express = require('express');
const cors = require('cors');
const { Keypair } = require('@solana/web3.js');
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

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);
client.connect();
console.log('db connected');
const database = client.db('solana_dex');

const getMintAddress = async(symbol)=>{
  try{
    const collection = database.collection('mint_addresses');
    const result = await collection.findOne({ symbol: symbol }, { projection: { address: 1, decimal: 1 } });
    if(result){
      return {address:result.address, decimal:parseInt(result.decimal,10)};
    }
    else{
      return 'no mint address';
    }
  }
  catch(error){
    console.error("Error occurd getting mint address", error);
  }
}

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

const performSwap = async (fromToken, toToken, fromAmount, toAmount, slippage, walletAddress) => {
  try {
    const inputMintTokenData = await getMintAddress(fromToken);
    const inputMint = inputMintTokenData.address;
    const decimal = inputMintTokenData.decimal;  
    const outputMintTokenData = await getMintAddress(toToken);
    const outputMint = outputMintTokenData.address;
    const res = await axios.get(process.env.JUPITER_SWAP_QUOTE_API_URL,{
      params:{
        inputMint:inputMint,
        outputMint:outputMint,
        amount: fromAmount * Math.pow(10, decimal),
        slippageBps:slippage*100,
      }
    });

    const quoteRes = res.data;
    const swapTransaction = await axios.post(process.env.JUPITER_SWAP_API_URL,{
      quoteResponse:quoteRes,
      userPublicKey: walletAddress,
      wrapAndUnwrapSol:true
    });
    const swapResult = swapTransaction.data.swapTransaction;
    //console.log('SWAP COMPLETED::', swapResult);
    return swapResult;
  } catch (error) {
    console.error('Error in performSwap:', error);
    throw new Error('Swap execution failed');
  }
};

app.post('/api/swap', async (req, res) => {
  try {
    const { fromToken, toToken, fromAmount, toAmount, slippage, walletAddress } = req.body;

    if (!fromToken || !toToken || !fromAmount || !toAmount || !slippage || !walletAddress) {
      return res.status(400).json({ message: 'Invalid input parameters' });
    }

    const swapResult = await performSwap(fromToken, toToken, fromAmount, toAmount, slippage, walletAddress);

    res.json({ message: 'Swap successful', swapResult });
  } catch (error) {
    ////console.error('Error during swap:', error);
    res.status(500).json({ error: 'Swap failed', details: error.message });
  }
});
async function placeLimitOrder(fromToken, toToken, price, amount, walletAddress, totalUSDC, sendingBase) {
  try {
    const inputMintTokenData = await getMintAddress(fromToken);
    const inputMint = inputMintTokenData.address;
    const inDecimal = inputMintTokenData.decimal
    const inAmount = amount * Math.pow(10, inDecimal);
    const outputMintTokenData = await getMintAddress(toToken);
    const outputMint = outputMintTokenData.address;
    const outDecimal = outputMintTokenData.decimal;
    const outAmount =  totalUSDC * Math.pow(10, outDecimal);
    const {data:tx} = await axios.post(`${process.env.JUPITER_LIMIT_ORDER_API_RUL}createOrder`,{
      owner:walletAddress,
      inAmount: inAmount,
      outAmount: outAmount,
      inputMint:inputMint,
      outputMint, outputMint,
      expiredAt: null,
      base : sendingBase
    },{
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return tx;
  } catch (error) {
    console.error('Error in placeLimitOrder:', error);
    throw new Error('Limit order placement failed');
  }
}

app.post('/api/limit-order', async (req, res) => {
  try {
    const { fromToken, toToken, price, amount, walletAddress, totalUSDC, sendingBase } = req.body;

    const orderResult = await placeLimitOrder(fromToken, toToken, price, amount, walletAddress, totalUSDC, sendingBase);

    res.json({ message: 'Limit order placed successfully', orderResult });
  } catch (error) {
    console.error('Error placing limit order:', error);
    res.status(500).json({ error: 'Failed to place limit order', details: error.message });
  }
});

async function placeDCAOrder(fromToken, toToken) {
  try {
    // Simulate the DCA order placement for demonstration purposes
    const inputMintTokenData =await getMintAddress(fromToken);
    const inputMint = inputMintTokenData.address;
    const inputDecimal = inputMintTokenData.decimal;
    const outputMintTokenData =await getMintAddress(toToken);
    const outputMint = outputMintTokenData.address;
    const outputDecimal = outputMintTokenData.decimal;

    return {
      inputMint:inputMint,
      outputMint:outputMint,
      inputDecimal:inputDecimal,
      outputDecimal:outputDecimal
    };
  } catch (error) {
    console.error('Error in placeDCAOrder:', error);
    throw new Error('DCA order placement failed');
  }
}

app.post('/api/dca-order', async (req, res) => {
  try {
    const { fromToken, toToken, amount, frequency, interval, numOrders } = req.body;

    const orderResult = await placeDCAOrder(fromToken, toToken);
    console.log('Order Result:',orderResult);
    res.json({ message: 'DCA order placed successfully', orderResult });
  } catch (error) {
    ////console.error('Error placing DCA order:', error);
    res.status(500).json({ error: 'Failed to place DCA order', details: error.message });
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

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  //console.log(`Server running at http://localhost:${PORT}`);
});

