import React, { useState } from 'react';
import Search from '../components/Search';
import TradingHistory from '../components/TradingHistory';

const Trade = () => {
  const [tokens, setTokens] = useState([
    // Example tokens
    { name: 'Token 1', symbol: 'TK1' },
    { name: 'Token 2', symbol: 'TK2' },
  ]);
  const [filteredTokens, setFilteredTokens] = useState(tokens);

  const handleSearch = (query, filter) => {
    setFilteredTokens(tokens.filter(token =>
      token.name.toLowerCase().includes(query.toLowerCase()) ||
      token.symbol.toLowerCase().includes(query.toLowerCase())
    ));
  };

  return (
    <main>
      <h2>Trade Page</h2>
      <Search onSearch={handleSearch} />
      <ul>
        {filteredTokens.map(token => (
          <li key={token.symbol}>{token.name} ({token.symbol})</li>
        ))}
      </ul>
      <TradingHistory />
    </main>
  );
};

export default Trade;
