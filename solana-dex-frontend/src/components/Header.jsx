import React, {useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton  } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';
import { useWallet } from '@solana/wallet-adapter-react';

// import ThemeToggle from './ThemeToggle';
import '../styles/header.css';
import logo from '../images/cryptosionLogo.png';
import setting from '../images/setting.png';
import clock from '../images/clock.png';

const Header = () => {
  const location = useLocation();
  const isTradePage = location.pathname.startsWith('/trade') || 
                      location.pathname === '/swap' || 
                      location.pathname === '/limit-order' || 
                      location.pathname === '/dca' || 
                      location.pathname === '/perps' ||
                      location.pathname === '/yield-farming';
  const isEcosystemPage = location.pathname.startsWith('/ecosystem');
  const { publicKey, autoConnect, connect, disconnect, connected, select, wallet } = useWallet();
  
  const handleConnect = async() => {
    select(PhantomWalletName)
    await connect();
  }

  return (
    <>
      <header>
        <div className="main-nav">
          <div className='header-logo'>
            <img src={logo}/>
            <h1><Link to="/trade" className="logo-link">Cryptosion</Link></h1>
          </div>
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
              {/* <WalletMultiButton/> */}
              {connected ? (
                    <div className="swap">
                        <button onClick={() => disconnect()}>Disconnect</button>
                        <br></br>
                    </div>
                ) : (
                    <div className="swap">
                        <button onClick={() => handleConnect()}>Connect Wallet</button>
                    </div>
                )}
            {/* <ThemeToggle /> */}
          </div>
        </div>
      </header>
      <div className='sub-nav-wrapper'>
        {isTradePage && (
          <div classname='sub-nav-swap-wrapper'>
            <div className="sub-nav">
              <nav>
                <ul>
                  <li><Link to="/swap" className={location.pathname === '/swap' ? 'active' : ''}>Swap</Link></li>
                  <li><Link to="/limit-order" className={location.pathname === '/limit-order' ? 'active' : ''}>Limit</Link></li>
                  <li><Link to="/dca" className={location.pathname === '/dca' ? 'active' : ''}>DCA</Link></li>
                  <li><Link to="/perps" className={location.pathname === '/perps' ? 'active' : ''}>Perps</Link></li>
                  <li><Link to="/yield-farming" className={location.pathname === '/yield-farming' ? 'active' : ''}>CRPT Presale</Link></li>
                </ul>
              </nav>
            </div>
         
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
      </div>
    </>
    
  );
};

export default Header;
