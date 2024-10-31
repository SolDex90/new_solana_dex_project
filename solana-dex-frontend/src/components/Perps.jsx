import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import TradingViewChart from './TradingViewChart';
import '../styles/perps.css';
import { fetchChartData } from '../fetchChartData'; // Adjust the import path if necessary
import '../styles/perps.css';
import folder from '../images/tokenAmount.png';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction, PublicKey,Connection } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import {  BN, BulkAccountLoader, DriftClient, initialize, QUOTE_PRECISION, User, Wallet, OrderType, PositionDirection, PerpMarkets, calculateBidAskPrice, convertToNumber, PRICE_PRECISION, getMarketOrderParams, BASE_PRECISION,MarketType } from '@drift-labs/sdk';
import { connection } from '../config';

import usdcImg from '../images/usdc.png';
import solImg  from '../images/sol.png';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const PerpsOrder = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [orderStatus, setOrderStatus] = useState('');

  const [selectedItem, setSelectedItem] = useState('Positions');
  const [manageItem, setManagedItem] = useState('Deposit');

  const [entryPrice, setEntryPrice] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('15m'); // Default timeframe
  const [position, setPosition] = useState('long'); // Add state for position
  const [leverage, setLeverage] = useState(1); // Add state for leverage

  const [driftClients, setDriftClient] = useState(null);

  const [formattedBidPrice, setFormattedBidPrice] = useState(0);
  const [formattedAskPrice, setFormattedAskPrice] = useState(0);
  const [orders, setOrders] = useState([]);
  const [isLong, setLong] = useState(false);
  const [pnl, setPnl] = useState(0);
  const [baseAmount, setBaseAmount] = useState(0);

  const [balance, setBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
    
  // State for the order types
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState(0);
  const [solPrice, setSolPrice] = useState(0);
  const [tokenType, setTokenType] = useState("SOL");

  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const wallet = useWallet();
  // let driftClient;
  const env = 'mainnet-beta';
  // Initialize Drift SDK
  const sdkConfig = initialize({ env });

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get('https://api.cryptosion.io/api/tokens');
        setTokens(response.data);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setOrderStatus('Failed to fetch tokens');
      }
    };

    fetchTokens();
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(`https://price.jup.ag/v6/price?ids=${fromToken},${toToken}`);
        const pricesData = response.data.data;

        if (pricesData[fromToken].price && !price) {
          setPrice(pricesData[fromToken].price);
          setEntryPrice(pricesData[fromToken].price);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
        setOrderStatus('Failed to fetch prices');
      }
    };

    if (fromToken && toToken) {
      fetchPrices();
    }
  }, [fromToken, toToken, price]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await fetchChartData('SOL', timeframe); // Fetch SOL chart data
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setOrderStatus('Failed to fetch chart data');
      }
    };

    loadChartData();
  }, [timeframe]);

  useEffect(() => {
    const fetchBalance = async () => {
        if(!wallet.publicKey) return

        try {
            const balance = await connection.getBalance(wallet.publicKey);
            setBalance(balance / 1000000000); // Convert lamports to SOL

            let usdcAddress = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
            let usdcTokenAccount = await getAssociatedTokenAddress(
                usdcAddress,
                wallet.publicKey,
            );
            const usdcBalance = await connection.getTokenAccountBalance(
                usdcTokenAccount
            );
            setUsdcBalance(Number(usdcBalance.value.uiAmount));

        } catch (err) {
            console.log('Error fetching balance', err);
        }
    };
    if(wallet.publicKey) {
      fetchBalance();
      initDrift();
    }
  }, [wallet.publicKey]);


  const initDrift = async() => {
    try {
        if(!wallet.publicKey) return;
        
        const driftPublicKey = new PublicKey(sdkConfig.DRIFT_PROGRAM_ID);
        const bulkAccountLoader = new BulkAccountLoader(
            connection,
            'confirmed',
            1000
        );

        let driftClient = new DriftClient({
            connection: connection,
            wallet: wallet,
            programID: driftPublicKey,
            accountSubscription: {
                type: 'polling',
                accountLoader: bulkAccountLoader,
            },
        });

        await driftClient.subscribe();
        console.log('subscribed to driftClient');

        const solMarketInfo = PerpMarkets[env].find(
          (market) => market.baseAssetSymbol === 'SOL'
        );
  
        if(solMarketInfo == undefined) return;
  
        const marketIndex = solMarketInfo.marketIndex;
        // Get vAMM bid and ask price
        const [bid, ask] = calculateBidAskPrice(
          driftClient.getPerpMarketAccount(marketIndex).amm,
          driftClient.getOracleDataForPerpMarket(marketIndex)
        );

        const formattedBidPrice = convertToNumber(bid, PRICE_PRECISION);
        setFormattedBidPrice(formattedBidPrice);
        const formattedAskPrice = convertToNumber(ask, PRICE_PRECISION);
        setFormattedAskPrice(formattedAskPrice);
        console.log(formattedBidPrice, formattedAskPrice);
        
        setDriftClient(driftClient);
        // Set up user client
        const user = new User({
            driftClient: driftClient,
            userAccountPublicKey: await driftClient.getUserAccountPublicKey(),
            accountSubscription: {
                type: 'polling',
                accountLoader: bulkAccountLoader,
            },
        });
        await user.subscribe();

        const tokenAmount = user.getTokenAmount(
          marketIndex,
        );
        setTokenAmount(Number(tokenAmount) / 10 ** 6);
        setMaxAmount(Number(tokenAmount) * 20 / 10 ** 6 / price);

        // const marketIndex = 0;
        const baseAssetAmount = user.getPerpPosition(
          marketIndex,
        );

        const isDeposit = tokenAmount.gte(new BN(0));
        const isBorrow = tokenAmount.lt(new BN(0));

        const isLong = baseAssetAmount.baseAssetAmount.gte(new BN(0));
        const isShort = baseAssetAmount.baseAssetAmount.lt(new BN(0));
        if(isLong){
          setBaseAmount(Number(baseAssetAmount.baseAssetAmount));
          setLong(true);
        } else if(isShort) {
          setBaseAmount(Number(baseAssetAmount.baseAssetAmount) * (-1));
          setLong(false);
        }

        const orders = user.getOpenOrders();
        setOrders(orders);

        let pnl = user.getUnrealizedPNL();
        setPnl(Number(pnl) / 10 ** 6);
    } catch (error) {
        console.log(error);
        // setNewUser(true);
    }
  }

  const fetchAndParseCSV = async(marketSymbol, year, month, day) => {
    const url = `${import.meta.env.VITE_URL_PREFIX}/market/${marketSymbol}/tradeRecords/${year}/${year}${month}${day}`;
    console.log(url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const csvText = await response.text();
      console.log("csvText->",csvText);

      // const records = parse(csvText, {
      //   skip_empty_lines: true
      // });
  
      // records.forEach((row) => {
      //   console.log(row);
      // });
    } catch (error) {
      console.error('Error fetching or parsing CSV:', error);
    }
  }

  const handleLeverage = async(e) => {
    try {
      const tempLeverage = Number(e.target.value);
      setLeverage(Number(tempLeverage.toFixed(2)));
      setAmount(Number((tokenType == 'USDC' ? tempLeverage * tokenAmount : tempLeverage * tokenAmount / price).toFixed(2)));
    } catch (error) {
      console.log(error);
    }
  }

  const handleAmountChange = (e) => {
    const tempAmount = Number(e.target.value);
    console.log(tempAmount, maxAmount)
    if(tempAmount >maxAmount){
      return;
    }
  
    setAmount(tempAmount);
    console.log("tokenType", tokenType);

    const leverageValue = tokenType == 'USDC' ? (Number(e.target.value) / tokenAmount).toFixed(2):  (Number(e.target.value) / tokenAmount * price).toFixed(2);
    console.log("leverageValue->", leverageValue);
    setLeverage(Number(leverageValue));
  };

  const handleTokenType = () => {
    if(tokenType == "SOL") {
      setTokenType('USDC');
      setAmount(amount * price);
      setMaxAmount(maxAmount * price);
    } else {
      setTokenType('SOL');
      setAmount(amount / price);
      setMaxAmount(maxAmount / price);
    }
  }

  const handlePlaceOrder = async () => {
    setOrderStatus('Placing order...');
    try {
      if(!wallet.publicKey) return;

      let userOrderType = null;
      let userPosition = null;
      console.log("orderType->", orderType);
      console.log("tokenType->", tokenType);
      console.log("position->", position);

      if(orderType == "market") {
          userOrderType = OrderType.MARKET;
      } else if (orderType == "Limit") {
          userOrderType = OrderType.LIMIT
      }

      if(position == "short") {
          userPosition = PositionDirection.SHORT
      } else if(position == "long") {
          userPosition = PositionDirection.LONG
      }

      console.log("amount->", amount);
      console.log("price->", price);

      if(tokenType == "USDC") {
          if(amount < price * 0.1) return
      }  else if(tokenType =="SOL") {
          if(amount <0.1) return
      }
 
      const solMarketInfo = PerpMarkets[env].find(
        (market) => market.baseAssetSymbol === 'SOL'
      );

      if(solMarketInfo == undefined) return;

      const tradeSize = tokenType === 'USDC'? amount / price : amount;

      if(orderType == "market") {
        const orderParams = {
          orderType: OrderType.MARKET,
          marketIndex: 0,
          direction: userPosition,
          baseAssetAmount: new BN(tradeSize * BASE_PRECISION),
        }
        await driftClients.placePerpOrder(orderParams);
        setOrderStatus('Order placed successfully!');
      } else {
        const orderParams = {
          orderType: OrderType.LIMIT,
          marketIndex: 0,
          direction: userPosition,
          baseAssetAmount: new BN(tradeSize * BASE_PRECISION),
          price: driftClients.convertToPricePrecision(entryPrice),
        }
        await driftClients.placePerpOrder(orderParams);
        setOrderStatus('Order placed successfully!');
      }
      await initDrift();

    } catch (error) {
      console.error('Error placing order:', error);
      setOrderStatus('Failed to place order. Please try again.');
    }
  };

  const handleDeposit = async() => {
    try {
      if (depositAmount <= 0) return
      if(!wallet.publicKey) return
  
      const marketIndex = 0; // USDC
      const amount = driftClients.convertToSpotPrecision(marketIndex, depositAmount); // $100
      const associatedTokenAccount = await driftClients.getAssociatedTokenAccount(marketIndex);
  
      const txSig = await driftClients.deposit(
          amount,
          marketIndex,
          associatedTokenAccount,
      );
      console.log("txSig->", txSig);

      initDrift()
    } catch (error) {
      console.log(error);
    }
  }

  const handleWithdraw = async() => {
    try {
      if(!driftClients) null;
      const marketIndex = 0;
      console.log(withdrawAmount);
      const amount = driftClients.convertToSpotPrecision(marketIndex, withdrawAmount);
      console.log(Number(amount));
      const associatedTokenAccount = await driftClients.getAssociatedTokenAccount(marketIndex);

      const txSig = await driftClients.withdraw(
        amount,
        marketIndex,
        associatedTokenAccount,
      );
      console.log("withdraw success", txSig);

      initDrift()
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancelPosition = async() => {
    try {
      if(!driftClients) return;
      const direction = !isLong?PositionDirection.LONG : PositionDirection.SHORT;
      const orderParams = {
        orderType: OrderType.MARKET,
        marketIndex: 0,
        direction: direction,
        baseAssetAmount: new BN(baseAmount),
      }
      const txSig = await driftClients.placePerpOrder(orderParams);
      console.log("txSig->", txSig);
      await initDrift();
    } catch (error) {
      console.log(error);
    }
  }

  const handleSettle = async() => {
    try {
      if(pnl <= 0) return;
      const marketIndex = 0;
      const user =  driftClients.getUser();
      const txSig = await driftClients.settlePNL(
        user.userAccountPublicKey,
        user.getUserAccount(),
        marketIndex
      );
      console.log("txSig->", txSig);
      await initDrift();
    } catch (error) {
      console.log(error);
    }
  }

  const handleClick = (item) => {
    setSelectedItem(item);
    console.log(`You clicked on ${item}`);
  };

  const sizeOfPosition = (amount && price && leverage)
    ? (amount * price * leverage).toFixed(2)
    : '0.00';

  return (
    <div className="perps-page">
      <div className="perps-price-chart-container">
        <div>
          <TradingViewChart/>
        </div>
        <div className="perps-history">
          <ul>
            {['Positions', 'Orders', 'Trades', 'Balances', 'Account'].map((item) => (
              <li key={item} onClick={() => handleClick(item)} className={selectedItem == item ?'active':''}>
                {item}
              </li>
            ))}
          </ul>
          <table>
            <thead>
              <tr>
                <th>Market</th>
                <th>Size</th>
                <th>P&L</th>
                <th>Take Profit</th>
                <th>Stop Loss</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {baseAmount !== 0 && <tr>
                <td>SOL-PERP <p className={isLong?'long':'short'}>{isLong?'Long':'Short'}</p></td>
                <td>{baseAmount / 10 ** 9}SOL</td>
                <td className={Number(pnl)>=0?'pnl-positive':'pnl-negative'}>${pnl}</td>
                <td>+ Add</td>
                <td>+ Add</td>
                <td>
                  <div className='action'>
                    <MdCancel onClick={handleCancelPosition}/>
                    <FaCheck onClick={handleSettle}/>
                  </div>
                </td>
              </tr>}
             
            </tbody>
          </table>
        </div>
      </div>
      <div className="perps-container">
        <div className="perps-section">
          <div className="order-type-toggle">
            <div className={orderType === 'market' ? 'active' : ''} onClick={() => setOrderType('market')}>
              Market
            </div>
            <div className={orderType === 'limit' ? 'active' : ''} onClick={() => setOrderType('limit')}>
              Limit
            </div>
          </div>
          <div className="position-toggle">
            <button className={position === 'long' ? 'active' : ''} onClick={() => setPosition('long')}>
              Long
            </button>
            <button className={position === 'short' ? 'active' : ''} onClick={() => setPosition('short')}>
              Short
            </button>
          </div>
        </div>
        <div className="perps-section">
          <div className="perps-section-header">
            <h3>Trade Size</h3>
            <div className="right-section">
              <img src={folder} alt="Token" />
              <span>Max: {tokenAmount == 0 ? 0 : (tokenAmount * 20 ).toFixed(2)} USDC</span>
            </div>
          </div>
          <div className="perps-input-group">
            <div className='perps-input-type' onClick={handleTokenType}>
              {
                tokenType == "SOL" ?
                <img src={solImg}/>:<img src={usdcImg}/>
              } 
              {
                tokenType == "SOL" ?
                'SOL':'USDC'
              }
            </div>
            <input
              type="number"
              value={amount}
              min={tokenType === "USDC" ? Number(price) * 0.1 : 0.1}
              max={maxAmount}
              onChange={handleAmountChange}
              placeholder="0.0"
              step={tokenType === "USDC"? 1 : 0.01}
              className="perps-input"
              style={{ marginLeft: '10px', width: '100px', padding: '10px' }}
            />
          </div>
          <p>Min Price is 0.1 SOL</p>

          {/* <div className="perps-input-group">
            <label>Sell {fromToken} at </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="perps-input"
            />
          </div> */}
        </div>
        <div className="perps-section">
          <h3>Est. Entry Price</h3>
          <div className="perps-input-group right-section">
            <label>SOL: </label>
            {orderType == "market"?
              <input
                type="number"
                value={position == "long" ? formattedAskPrice.toFixed(4) : formattedBidPrice.toFixed(4)}
                readOnly
                className="perps-input"
              />
              :
              <input
                type="number"
                value={entryPrice.toFixed(2)}
                min={0}
                step={1}
                className="perps-input"
                onChange={(e) => (setEntryPrice(Number(e.target.value)))}
              />
            }
          
          </div>
        </div>
        <div className="perps-section">
          <h3>Leverage</h3>
          <input
            type="range"
            min={1}
            max={20}
            value={leverage}
            step={0.01}
            onChange={(e) => handleLeverage(e)}
            className="leverage-slider"
          />
          <span>{leverage}x</span>
        </div>
        <button onClick={handlePlaceOrder} className="perps-button">
          Place Perps Order
        </button>
        <div className='preps-deposit'>
          <div className='preps-depost-data'>
            <p>Net Account Value</p>
            <p>{(tokenAmount).toFixed(2)} USDC</p>
          </div>
          <div className='preps-deposit-btn'>
            <button onClick={openModal} className="perps-button">
              Deposit
            </button>
          </div>
        </div>
        {orderStatus && <p>{orderStatus}</p>}
        </div>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                  <h2>Manage Balances</h2>
                  <button className="close-btn" onClick={closeModal}>
                      &times;
                  </button>
                </div>

                <div className="modal-body">
                  <div className="tabs">
                      <button className={ manageItem == 'Deposit' ? 'tab active' : 'tab'} onClick={() => setManagedItem('Deposit')}>Deposit</button>
                      <button className={ manageItem == 'Withdraw' ? 'tab active' : 'tab'} onClick={() => setManagedItem('Withdraw')}>Withdraw</button>
                      <button className={ manageItem == 'Borrow' ? 'tab active' : 'tab'} onClick={() => setManagedItem('Borrow')}>Borrow</button>
                      <button className={ manageItem == 'Transfer' ? 'tab active' : 'tab'} onClick={() => setManagedItem('Transfer')}>Transfer</button>
                  </div>
                  {
                    manageItem == "Deposit" && <div className="transfer-section">
                      <label htmlFor="transfer-amount">Transfer type and Amount</label>
                      <select id="transfer-amount" className="transfer-select">
                        <option>USDC</option>
                      </select>
                      <input type="number" min={0} step={1} placeholder="Enter amount" className="amount-input" value={depositAmount} onChange={(e) => {setDepositAmount(Number(e.target.value))}}/>

                      <div className="balance-info">
                          <p>Wallet SOL balance: {balance} SOL</p>
                          <p>Wallet USDC balance: {usdcBalance.toFixed(2)} USDC</p>
                      </div>

                      <div className="summary">
                      <p>Asset Balance: {} SOL</p>
                      <p>Net Account Balance (USD): ${(tokenAmount).toFixed(2)}</p>
                      {/* <p>Interest Rate: 449.4558%</p> */}
                      </div>
                  </div>
                  }
                  {
                    manageItem == "Withdraw" && 
                    <div className="transfer-section">
                      <label htmlFor="transfer-amount">Withdraw type and Amount</label>
                      <select id="transfer-amount" className="transfer-select">
                        <option>USDC</option>
                      </select>
                      <input type="number" min={0} max={tokenAmount} step={1} placeholder="Enter amount" className="amount-input" value={withdrawAmount} onChange={(e) => {setWithdrawAmount(Number(e.target.value))}}/>

                      <div className="summary">
                        <p>Asset Balance: {} SOL</p>
                        <p>Net Account Balance (USD): ${(tokenAmount).toFixed(2)}</p>
                        <p>P&L: ${pnl} <span className='settle' onClick={handleSettle}>Settle Now</span></p>
                      </div>
                    </div>
                  }
                </div>

                <div className="modal-footer">
                  <button className="confirm-btn" onClick={manageItem=="Deposit" ?() =>handleDeposit(): () =>handleWithdraw()}>{manageItem=="Deposit" ? 'Confirm Deposit':'Confirm Withdraw'}</button>
                </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default PerpsOrder;
