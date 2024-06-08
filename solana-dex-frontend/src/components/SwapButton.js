import React from 'react';

const SwapButton = ({ onClick }) => (
  <button className="flip-button" onClick={onClick}>
    ⬆️⬇️
  </button>
);

export default SwapButton;
