import React from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Notifications from './Notifications';
import '../styles/styles.css'; // Ensure this path is correct

const Header = () => {
  return (
    <header>
      <h1>Solana DEX</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li className="dropdown">
            <Link to="/swap" className="dropbtn">Trade</Link> {/* Direct link to Swap */}
            <div className="dropdown-content">
              <Link to="/swap">Swap</Link>
              <Link to="/limit-order">Limit Order</Link>
              <Link to="/stop-loss">Stop-Loss</Link>
              <Link to="/dca">DCA</Link>
              <Link to="/perps">Perps</Link>
            </div>
          </li>
          <li><Link to="/portfolio">Portfolio</Link></li>
          <li><Link to="/trading-dashboard">Trading Dashboard</Link></li>
        </ul>
      </nav>
      <div className="header-right">
        <Notifications />
        <WalletMultiButton />
      </div>
    </header>
  );
};

export default Header;
