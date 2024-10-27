import React from 'react';

const Slippage = ({ slippage, setIsSlippageModalOpen }) => (
  <div>
    <button className="btn dynamic">Dynamic</button>
    <button className="btn fixed active" onClick={() => setIsSlippageModalOpen(true)}>Fixed</button>
  </div>
);

export default Slippage;
