import React, { useRef, useEffect } from 'react';

const Dropdown = ({ tokens, selectedToken, onSelectToken, showDropdown, setShowDropdown }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowDropdown]);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="dropdown-selected" onClick={() => setShowDropdown(!showDropdown)}>
        {selectedToken || 'Select Token'}
      </div>
      {showDropdown && (
        <div className="dropdown-menu">
          <input type="text" placeholder="Search by token or paste address" className="dropdown-search" />
          {tokens.map((token) => (
            <div key={token.address} className="dropdown-item" onClick={() => onSelectToken(token.symbol)}>
              {token.symbol}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
