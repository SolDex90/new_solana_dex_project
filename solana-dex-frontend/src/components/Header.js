import React from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header = () => {
  return (
    <header>
      <h1>Solana DEX</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li className="dropdown">
            <button className="dropbtn">Trade</button>
            <div className="dropdown-content">
              <Link to="/swap">Swap</Link>
              <Link to="/limit-order">Limit Order</Link>
              <Link to="/stop-loss">Stop-Loss</Link>
              <Link to="/dca">DCA</Link>
              <Link to="/perps">Perps</Link>
            </div>
          </li>
          <li><Link to="/portfolio">Portfolio</Link></li> {/* Updated from Dashboard to Portfolio */}
          <li><Link to="/trading-dashboard">Trading Dashboard</Link></li>
        </ul>
      </nav>
      <WalletMultiButton />
    </header>
  );
};

export default Header;
