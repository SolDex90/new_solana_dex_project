import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const PortfolioAnalytics = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [analytics, setAnalytics] = useState({ totalValue: 0, gainsLosses: 0 });

  useEffect(() => {
    const fetchPortfolio = async () => {
      const user = auth.currentUser;
      if (user) {
        const portfolioRef = collection(firestore, 'portfolios');
        const q = query(portfolioRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const assets = [];
        querySnapshot.forEach((doc) => {
          assets.push(doc.data());
        });
        setPortfolio(assets);

        // Calculate analytics
        const totalValue = assets.reduce((acc, asset) => acc + asset.amount * asset.currentPrice, 0);
        const gainsLosses = assets.reduce((acc, asset) => acc + asset.amount * (asset.currentPrice - asset.purchasePrice), 0);
        setAnalytics({ totalValue, gainsLosses });
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div>
      <h2>Portfolio Analytics</h2>
      <p>Total Value: ${analytics.totalValue.toFixed(2)}</p>
      <p>Gains/Losses: ${analytics.gainsLosses.toFixed(2)}</p>
      <ul>
        {portfolio.map((asset, index) => (
          <li key={index}>
            {asset.name}: {asset.amount} @ ${asset.currentPrice.toFixed(2)} (Purchased @ ${asset.purchasePrice.toFixed(2)})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioAnalytics;
