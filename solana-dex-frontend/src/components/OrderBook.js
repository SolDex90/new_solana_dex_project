import React, { useState, useEffect } from 'react';

// Remove the axios import since it's not currently used
// import axios from 'axios';

const mockOrderBookData = {
  bids: [
    { price: 50000, amount: 1 },
    { price: 49900, amount: 2 },
  ],
  asks: [
    { price: 50100, amount: 1 },
    { price: 50200, amount: 2 },
  ],
};

const OrderBook = ({ pair }) => {
  const [orders, setOrders] = useState({ bids: [], asks: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        // Mock data for development
        // Uncomment the following line and replace with your actual API endpoint when available
        // const response = await axios.get(`https://api.youractualendpoint.com/orderbook/${pair}`);
        // setOrders(response.data);

        // Using mock data
        setOrders(mockOrderBookData);
        setError(null); // Clear any previous error
      } catch (err) {
        console.error('Error fetching order book:', err);
        setError('Error fetching order book');
      }
    };

    fetchOrderBook();
  }, [pair]);

  return (
    <div>
      <h2>Order Book for {pair}</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <div>
            <h3>Bids</h3>
            <ul>
              {orders.bids.map((bid, index) => (
                <li key={index}>
                  {bid.price} - {bid.amount}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Asks</h3>
            <ul>
              {orders.asks.map((ask, index) => (
                <li key={index}>
                  {ask.price} - {ask.amount}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderBook;
