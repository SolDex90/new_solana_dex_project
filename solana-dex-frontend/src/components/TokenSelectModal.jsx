import React, { useState, useMemo } from 'react';
import '../styles/token-select-modal.css';

const TokenSelectModal = ({ isOpen, tokens, onSelectToken, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Define popular tokens that should always be shown first
  const popularTokenSymbols = useMemo(() => [
    'SOL', 'USDC', 'USDT', 'ETH', 'BTC', 'BONK', 'RAY', 'SRM'
  ], []);

  // Filter and sort tokens
  const filteredTokens = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase().trim();
    
    if (!searchTerm) {
      // If no search term, show popular tokens first, then others up to 50 total
      const popularTokens = tokens.filter(token => 
        popularTokenSymbols.includes(token.symbol)
      );
      
      const otherTokens = tokens
        .filter(token => !popularTokenSymbols.includes(token.symbol))
        .slice(0, 50 - popularTokens.length);
      
      return [...popularTokens, ...otherTokens];
    }

    // If searching, show all matching tokens
    return tokens.filter(token => 
      token.symbol.toLowerCase().includes(searchTerm) ||
      token.name.toLowerCase().includes(searchTerm) ||
      token.address.toLowerCase().includes(searchTerm)
    );
  }, [tokens, searchQuery, popularTokenSymbols]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = '/fallback-token-icon.png'; // Replace with your fallback image path
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Select Token</h2>
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search name or paste address" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="token-list">
          {!searchQuery && (
            <div className="token-list-section">
              <h3 className="section-title">Popular Tokens</h3>
            </div>
          )}
          {filteredTokens.map((token) => (
            <div 
              key={token.address} 
              className="token-item" 
              onClick={() => {
                onSelectToken(token);
                onClose();
              }}
            >
              <img 
                src={token.logoURI} 
                alt={token.symbol} 
                className="token-image"
                onError={handleImageError}
                loading="lazy" // Enable lazy loading for images
              />
              <div className="token-info">
                <span className="token-symbol">{token.symbol}</span>
                <span className="token-name">{token.name}</span>
              </div>
            </div>
          ))}
          {searchQuery && filteredTokens.length === 0 && (
            <div className="no-results">
              No tokens found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSelectModal;