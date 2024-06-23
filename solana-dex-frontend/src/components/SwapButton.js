import React from 'react';
import '../styles/swap-button.css';

const SwapButton = ({ onClick }) => (
  <button className="flip-button" onClick={onClick}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 5H9L12 2Z" fill="currentColor" />
      <path d="M12 22L9 19H15L12 22Z" fill="currentColor" />
    </svg>
  </button>
);

export default SwapButton;
