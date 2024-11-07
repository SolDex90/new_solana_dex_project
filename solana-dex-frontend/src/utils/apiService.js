// src/utils/apiService.js

const API_URL = process.env.VITE_APP_API_BASE_URL || 'http://localhost:5000';

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Fetch data error:', error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Post data error:', error);
    throw error;
  }
};

export const getMintFromSymbol =  (symbol, tokens) => {
  const mintAddress = tokens.find(token => token.symbol === symbol)?.address;
  return mintAddress;
};

export const getSymbolFromMint =  (mintAddress, tokens) => {
  const symbol = tokens.find(token => token.address === mintAddress)?.symbol;
  const symbolString = symbol;
  return symbolString;
};

export const getDecimalOfMint = (mintAddress, tokens)=>{
  const decimal = tokens.find(token=>token.address === mintAddress)?.decimals;
  console.log("Decimal:", decimal);
  return decimal;
};
