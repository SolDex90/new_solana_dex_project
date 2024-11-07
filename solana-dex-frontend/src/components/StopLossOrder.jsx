import React, { useState } from 'react';

const StopLossOrder = () => {
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStopLossOrder = async () => {
    if (!price || !amount) {
      setStatusMessage('Please enter valid price and amount.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('');

    try {
      // Replace with actual stop-loss order logic
      // For example, call your backend or blockchain here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a network request

      setStatusMessage(`Placed stop-loss order for ${amount} at ${price}`);
    } catch (error) {
      setStatusMessage(`Error placing order: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Stop-Loss Order</h2>
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
      <button onClick={handleStopLossOrder} disabled={isLoading}>
        {isLoading ? 'Placing Order...' : 'Place Stop-Loss Order'}
      </button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default StopLossOrder;
