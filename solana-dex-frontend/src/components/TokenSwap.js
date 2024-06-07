import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/token-swap.css';

const TokenSwap = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState('');

  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tokens');
        setTokens(response.data);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setError('Failed to fetch tokens');
      }
    };

    fetchTokens();
  }, []);

  const fetchPrices = async (tokenIds) => {
    setLoading(true);
    setError(null);
    try {
      const jupiterResponse = await axios.get(`https://price.jup.ag/v6/price?ids=${tokenIds.join(',')}`);
      console.log('Jupiter Response:', jupiterResponse.data);

      const jupiterPrices = Object.keys(jupiterResponse.data.data).reduce((acc, key) => {
        acc[jupiterResponse.data.data[key].mintSymbol] = jupiterResponse.data.data[key].price;
        return acc;
      }, {});

      console.log('Jupiter Prices:', jupiterPrices);
      setPrices(jupiterPrices);
    } catch (error) {
      console.error('Error fetching prices from Jupiter API:', error);
      setError('Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromToken && toToken) {
      fetchPrices([fromToken, toToken]);
    }
  }, [fromToken, toToken]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (fromAmount && prices[fromToken] && prices[toToken]) {
      const fromPrice = prices[fromToken];
      const toPrice = prices[toToken];
      const convertedAmount = (fromAmount * fromPrice / toPrice).toFixed(2);
      setToAmount(convertedAmount);
    } else {
      setToAmount('');
    }
  }, [fromAmount, prices, fromToken, toToken]);

  const handleSelectToken = (token, type) => {
    if (type === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowFromDropdown(false);
    setShowToDropdown(false);
    console.log(`Selected ${type} Token:`, token);
  };

  const handleSwap = async () => {
    // Implement the logic for confirming the swap transaction
    setTransactionStatus('Initiating transaction...');
    try {
      // Replace the following with the actual transaction logic
      await axios.post('http://localhost:3000/api/swap', {
        fromToken,
        toToken,
        fromAmount,
        toAmount
      });
      setTransactionStatus('Transaction successful!');
    } catch (error) {
      console.error('Error during transaction:', error);
      setTransactionStatus('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="token-swap-container">
      <div className="token-swap">
        <h3>Token Swap</h3>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {transactionStatus && <p>{transactionStatus}</p>}
        <div className="token-swap-inputs">
          <div className="token-swap-input">
            <label>From:</label>
            <div className="input-group">
              <div className="dropdown-container" ref={fromDropdownRef}>
                <div className="dropdown-selected" onClick={() => setShowFromDropdown(!showFromDropdown)}>
                  {fromToken || 'Select Token'}
                </div>
                {showFromDropdown && (
                  <div className="dropdown-menu">
                    <input type="text" placeholder="Search by token or paste address" className="dropdown-search"/>
                    {tokens.map((token) => (
                      <div key={token.address} className="dropdown-item" onClick={() => handleSelectToken(token.symbol, 'from')}>
                        {token.symbol}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="Amount"
                className="amount-input"
              />
            </div>
          </div>
          <div className="token-swap-input">
            <label>To:</label>
            <div className="input-group">
              <div className="dropdown-container" ref={toDropdownRef}>
                <div className="dropdown-selected" onClick={() => setShowToDropdown(!showToDropdown)}>
                  {toToken || 'Select Token'}
                </div>
                {showToDropdown && (
                  <div className="dropdown-menu">
                    <input type="text" placeholder="Search by token or paste address" className="dropdown-search"/>
                    {tokens.map((token) => (
                      <div key={token.address} className="dropdown-item" onClick={() => handleSelectToken(token.symbol, 'to')}>
                        {token.symbol}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="number"
                value={toAmount}
                readOnly
                placeholder="Amount"
                className="amount-input"
              />
            </div>
          </div>
        </div>
        <button onClick={handleSwap}>Swap</button>
      </div>
    </div>
  );
};

export default TokenSwap;
