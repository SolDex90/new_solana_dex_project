import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faExchangeAlt, faWallet, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <header>
      <h1>Solana DEX</h1>
      <nav>
        <ul>
          <li><Link to="/"><FontAwesomeIcon icon={faHome} /> Home</Link></li>
          <li><Link to="/trade"><FontAwesomeIcon icon={faExchangeAlt} /> Trade</Link></li>
          <li><Link to="/wallet"><FontAwesomeIcon icon={faWallet} /> Wallet</Link></li>
        </ul>
      </nav>
      <div>
        <button onClick={toggleDarkMode}>
          {darkMode ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
        </button>
        <WalletMultiButton />
      </div>
    </header>
  );
};

export default Header;
