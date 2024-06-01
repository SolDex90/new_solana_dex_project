import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const user = auth.currentUser;
      if (user) {
        const portfolioRef = firestore.collection('portfolios').doc(user.uid);
        const doc = await portfolioRef.get();
        if (doc.exists) {
          setPortfolio(doc.data().assets);
        }
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div>
      <h2>Your Portfolio</h2>
      <ul>
        {portfolio.map((asset, index) => (
          <li key={index}>{asset.name}: {asset.amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;
