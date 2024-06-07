import React from 'react';
import '../styles/slippage.css';

const Slippage = ({ slippage, setSlippage, visible }) => {
  if (!visible) return null;

  return (
    <div className="slippage-container">
      <h4>Slippage Tolerance</h4>
      <div className="slippage-options">
        {[0.1, 0.5, 1].map((value) => (
          <button
            key={value}
            className={`slippage-option ${slippage === value ? 'selected' : ''}`}
            onClick={() => setSlippage(value)}
          >
            {value}%
          </button>
        ))}
        <div className="custom-slippage">
          <label>Custom</label>
          <input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(parseFloat(e.target.value))}
            className="custom-slippage-input"
          />
          <span>%</span>
        </div>
      </div>
    </div>
  );
};

export default Slippage;
