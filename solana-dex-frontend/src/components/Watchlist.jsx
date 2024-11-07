import React from 'react';

const Watchlist = () => {
  // Fetch and display user's watchlist
  return (
    <div className="card">
      <h3>Watchlist</h3>
      <ul>
        <li>Bitcoin: $50000</li>
        <li>Ethereum: $3000</li>
        {/* List other watchlist items */}
      </ul>
    </div>
  );
};

export default Watchlist;
