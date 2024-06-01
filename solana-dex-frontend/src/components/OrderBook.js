import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderBook = ({ pair }) => {
  const [orders, setOrders] = useState({ bids: [], asks: [] });

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await axios.get(`https://api.exchange.com/orderbook/${pair}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching order book:', error);
      }
    };

    fetchOrderBook();
  }, [pair]);

  return (
    <div>
      <h2>Order Book for {pair}</h2>
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
    </div>
  );
};

export default OrderBook;
