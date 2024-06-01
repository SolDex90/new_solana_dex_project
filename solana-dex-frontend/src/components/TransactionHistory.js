import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = auth.currentUser;
      if (user) {
        const transactionsRef = collection(firestore, 'transactions');
        const q = query(transactionsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const transactionData = [];
        querySnapshot.forEach((doc) => {
          transactionData.push(doc.data());
        });
        setTransactions(transactionData);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.date}: {transaction.type} {transaction.amount} {transaction.token}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
