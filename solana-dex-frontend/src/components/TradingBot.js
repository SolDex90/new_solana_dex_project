import React, { useState } from 'react';

const TradingBot = () => {
  const [botName, setBotName] = useState('');
  const [strategy, setStrategy] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleCreateBot = () => {
    // Implement trading bot creation logic here
    setStatusMessage(`Created trading bot named ${botName} with strategy ${strategy}`);
  };

  return (
    <div>
      <h2>Create Trading Bot</h2>
      <input
        type="text"
        placeholder="Bot Name"
        value={botName}
        onChange={(e) => setBotName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Strategy"
        value={strategy}
        onChange={(e) => setStrategy(e.target.value)}
      />
      <button onClick={handleCreateBot}>Create Bot</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default TradingBot;
