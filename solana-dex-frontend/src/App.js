import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Wallet from './pages/Wallet';
import WalletProvider from './WalletProvider';
import Footer from './components/Footer';

const App = () => {
  return (
    <WalletProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
        <Footer />
      </Router>
    </WalletProvider>
  );
};

export default App;
