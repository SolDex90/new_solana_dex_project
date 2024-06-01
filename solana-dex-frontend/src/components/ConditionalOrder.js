import React, { useState } from 'react';

const ConditionalOrder = () => {
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleConditionalOrder = () => {
    // Implement conditional order logic here
    setStatusMessage(`Placed conditional order for ${amount} at ${price} when ${condition}`);
  };

  return (
    <div>
      <h2>Conditional Order</h2>
      <input
        type="text"
        placeholder="Condition"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleConditionalOrder}>Place Conditional Order</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default ConditionalOrder;
