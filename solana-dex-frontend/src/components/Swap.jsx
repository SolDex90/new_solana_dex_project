// import React, { useState } from 'react';
// import '../styles/token-swap.css';  // Correct import

// const Swap = () => {
//   const [fromToken, setFromToken] = useState('');
//   const [toToken, setToToken] = useState('');
//   const [amount, setAmount] = useState('');

//   const handleSwap = () => {
//     // Add swap logic here
//     console.log(`Swapping ${amount} of ${fromToken} to ${toToken}`);
//   };

//   return (
//     <div className="token-swap-container">
//       <div className="token-swap">
//         <h3>Token Swap</h3>
//         <div className="swap-input">
//           <label htmlFor="from-token">From:</label>
//           <input
//             type="text"
//             id="from-token"
//             placeholder="Enter token"
//             value={fromToken}
//             onChange={(e) => setFromToken(e.target.value)}
//           />
//         </div>
//         <div className="swap-input">
//           <label htmlFor="to-token">To:</label>
//           <input
//             type="text"
//             id="to-token"
//             placeholder="Enter token"
//             value={toToken}
//             onChange={(e) => setToToken(e.target.value)}
//           />
//         </div>
//         <div className="swap-input">
//           <label htmlFor="amount">Amount:</label>
//           <input
//             type="number"
//             id="amount"
//             placeholder="Enter amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//         </div>
//         <button type="button" onClick={handleSwap}>Swap</button>
//       </div>
//     </div>
//   );
// };

// export default Swap;