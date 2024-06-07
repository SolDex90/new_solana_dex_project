import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '../styles/header.css'; // Ensure this path is correct

const Header = () => {
  const location = useLocation();
  const isTradePage = location.pathname.startsWith('/trade') || 
                      location.pathname === '/swap' || 
                      location.pathname === '/limit-order' || 
                      location.pathname === '/stop-loss' || 
                      location.pathname === '/dca' || 
                      location.pathname === '/perps';

  return (
    <header>
      <div className="main-nav">
        <h1>Solana DEX</h1>
        <nav>
          <ul>
            <li><Link to="/trade" className={`main-link ${location.pathname === '/trade' ? 'active' : ''}`}>Trade</Link></li>
            <li><Link to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>Portfolio</Link></li>
            <li><Link to="/trading-dashboard" className={location.pathname === '/trading-dashboard' ? 'active' : ''}>Trading Dashboard</Link></li>
          </ul>
        </nav>
        <div className="header-right">
          {/* <Notifications />  Remove this line */}
          <WalletMultiButton />
        </div>
      </div>
      {isTradePage && (
        <div className="sub-nav">
          <nav>
            <ul>
              <li><Link to="/swap" className={location.pathname === '/swap' ? 'active' : ''}><span className="icon">🔄</span> Swap <span className="description">The Best Price</span></Link></li>
              <li><Link to="/limit-order" className={location.pathname === '/limit-order' ? 'active' : ''}><span className="icon">📊</span> Limit Order <span className="description">Set Your Price</span></Link></li>
              <li><Link to="/stop-loss" className={location.pathname === '/stop-loss' ? 'active' : ''}><span className="icon">🔔</span> Stop-Loss <span className="description">Set and Forget</span></Link></li>
              <li><Link to="/dca" className={location.pathname === '/dca' ? 'active' : ''}><span className="icon">⏳</span> DCA <span className="description">Set and Forget</span></Link></li>
              <li><Link to="/perps" className={location.pathname === '/perps' ? 'active' : ''}><span className="icon">💼</span> Perps <span className="description">Gateway to Heaven</span></Link></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
