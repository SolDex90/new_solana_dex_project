import React from 'react';
import '../styles/SwapComponent.css';

const Swap = () => {
  return (
    <div className="token-swap-container">
      <div className="token-swap">
        <h3>Token Swap</h3>
        <div className="swap-input">
          <label htmlFor="from-token">From:</label>
          <input type="text" id="from-token" placeholder="Enter token" />
        </div>
        <div className="swap-input">
          <label htmlFor="to-token">To:</label>
          <input type="text" id="to-token" placeholder="Enter token" />
        </div>
        <div className="swap-input">
          <label htmlFor="amount">Amount:</label>
          <input type="number" id="amount" placeholder="Enter amount" />
        </div>
        <button type="button">Swap</button>
      </div>
    </div>
  );
};

export default Swap;
