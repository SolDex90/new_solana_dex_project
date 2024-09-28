import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '../styles/header.css';

const Header = () => {
  const location = useLocation();
  const isTradePage = location.pathname.startsWith('/trade') || 
                      location.pathname === '/swap' || 
                      location.pathname === '/limit-order' || 
                      location.pathname === '/dca' || 
                      location.pathname === '/perps' ||
                      location.pathname === '/yield-farming';
  const isEcosystemPage = location.pathname.startsWith('/ecosystem');

  return (
    <header>
      <div className="main-nav">
        <h1><Link to="/trade" className="logo-link">Cryptosion</Link></h1>
        <nav>
          <ul>
            <li><Link to="/trade" className={`main-link ${isTradePage ? 'active' : ''}`}>Trade</Link></li>
            <li><Link to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>Portfolio</Link></li>
            <li><Link to="/trading-dashboard" className={location.pathname === '/trading-dashboard' ? 'active' : ''}>Trading Dashboard</Link></li>
            <li><Link to="/token-sniper" className={location.pathname === '/token-sniper' ? 'active' : ''}>Token Sniper</Link></li>
            <li><Link to="/ecosystem" className={`main-link ${isEcosystemPage ? 'active' : ''}`}>Ecosystem</Link></li>
          </ul>
        </nav>
        <div className="header-right">
          <WalletMultiButton />
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
              <li><Link to="/yield-farming" className={location.pathname === '/yield-farming' ? 'active' : ''}><span className="icon">🌾</span> Yield Farming</Link></li>
            </ul>
          </nav>
        </div>
      )}
      {isEcosystemPage && (
        <div className="sub-nav">
          <nav>
            <ul>
              <li><Link to="/ecosystem/gaming" className={location.pathname === '/ecosystem/gaming' ? 'active' : ''}><span className="icon">🎮</span> Gaming</Link></li>
              <li><Link to="/ecosystem/lending" className={location.pathname === '/ecosystem/lending' ? 'active' : ''}><span className="icon">💸</span> Lending</Link></li>
              <li><Link to="/ecosystem/music" className={location.pathname === '/ecosystem/music' ? 'active' : ''}><span className="icon">🎵</span> Music</Link></li>
              <li><Link to="/ecosystem/staking" className={location.pathname === '/ecosystem/staking' ? 'active' : ''}><span className="icon">🔒</span> Staking</Link></li>
              <li><Link to="/ecosystem/liquidity" className={location.pathname === '/ecosystem/liquidity' ? 'active' : ''}><span className="icon">💧</span> Liquidity</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
