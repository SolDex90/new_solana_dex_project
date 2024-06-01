import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { SERUM_PROGRAM_ID, Market } from '@project-serum/serum';

const LimitOrder = () => {
  const { publicKey, signTransaction } = useWallet();
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleLimitOrder = async () => {
    if (!publicKey) {
      setStatusMessage('Connect your wallet first');
      return;
    }

    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const marketAddress = new PublicKey('YOUR_MARKET_ADDRESS');
    const market = await Market.load(connection, marketAddress, {}, SERUM_PROGRAM_ID);

    const owner = publicKey;
    const payer = publicKey;

    const [order] = await market.placeOrder({
      owner,
      payer,
      side: 'buy', // 'buy' or 'sell'
      price: parseFloat(price),
      size: parseFloat(amount),
      orderType: 'limit', // 'limit', 'ioc', 'postOnly'
      clientId: new Date().getTime(),
    });

    const transaction = new Transaction().add(order);
    const signedTransaction = await signTransaction(transaction);

    try {
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(txid);
      setStatusMessage(`Order placed: ${txid}`);
    } catch (error) {
      setStatusMessage(`Error placing order: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Limit Order</h2>
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
      <button onClick={handleLimitOrder}>Place Limit Order</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default LimitOrder;
