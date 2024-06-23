import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import ThemeToggle from './ThemeToggle'; // Ensure this path is correct
import '../styles/header.css'; // Ensure this path is correct

const Header = () => {
  const location = useLocation();
  const isTradePage = location.pathname.startsWith('/trade') || 
                      location.pathname === '/swap' || 
                      location.pathname === '/limit-order' || 
                      location.pathname === '/dca' || 
                      location.pathname === '/perps';

  return (
    <header>
      <div className="main-nav">
        <h1><Link to="/trade" className="logo-link">Cryptosion</Link></h1> {/* Updated the logo/Dex name */}
        <nav>
          <ul>
            <li><Link to="/trade" className={`main-link ${isTradePage ? 'active' : ''}`}>Trade</Link></li>
            <li><Link to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>Portfolio</Link></li>
            <li><Link to="/trading-dashboard" className={location.pathname === '/trading-dashboard' ? 'active' : ''}>Trading Dashboard</Link></li>
            <li><Link to="/token-sniper" className={location.pathname === '/token-sniper' ? 'active' : ''}>Token Sniper</Link></li>
            <li><Link to="/gaming" className={location.pathname === '/gaming' ? 'active' : ''}>Gaming</Link></li> {/* New Gaming Link */}
          </ul>
        </nav>
        <div className="header-right">
          <WalletMultiButton />
          <ThemeToggle /> {/* Add the theme toggle button here */}
        </div>
      </div>
      {isTradePage && (
        <div className="sub-nav">
          <nav>
            <ul>
              <li><Link to="/swap" className={location.pathname === '/swap' ? 'active' : ''}><span className="icon">🔄</span> Swap <span className="description">The Best Price</span></Link></li>
              <li><Link to="/limit-order" className={location.pathname === '/limit-order' ? 'active' : ''}><span className="icon">📊</span> Limit Order <span className="description">Set Your Price</span></Link></li>
              <li><Link to="/dca" className={location.pathname === '/dca' ? 'active' : ''}><span className="icon">⏳</span> DCA <span className="description">Set and Forget</span></Link></li>
              <li><Link to="/perps" className={location.pathname === '/perps' ? 'active' : ''}><span className="icon">💼</span> Perps <span className="description">Perpetual Contracts</span></Link></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
