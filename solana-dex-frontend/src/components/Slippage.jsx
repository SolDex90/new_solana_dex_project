import React from 'react';
import { FaCog } from 'react-icons/fa';

const Slippage = ({ slippage, setIsSlippageModalOpen }) => (
  <div>
    <button className="btn dynamic">Dynamic</button>
    <button className="btn fixed active" onClick={() => setIsSlippageModalOpen(true)}>Fixed</button>

  </div>
  // <div className="slippage-container">
  //   <div className="slippage-label">Slippage</div>
  //   <div className="slippage-info">
  //     <span className="slippage-value">{slippage}%</span>
  //     <FaCog className="cog-icon" onClick={() => setIsSlippageModalOpen(true)} />
  //   </div>
  // </div>
);

export default Slippage;
