import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const TradingHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (user) {
        const historyRef = doc(firestore, 'tradingHistory', user.uid);
        const docSnap = await getDoc(historyRef);
        if (docSnap.exists()) {
          setHistory(docSnap.data().trades);
        }
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Trading History</h2>
      <ul>
        {history.map((trade, index) => (
          <li key={index}>{trade.date}: {trade.details}</li>
        ))}
      </ul>
    </div>
  );
};

export default TradingHistory;
