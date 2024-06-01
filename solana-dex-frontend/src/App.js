import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Wallet from './pages/Wallet';
import UserProfile from './components/UserProfile'; // Import UserProfile component
import WalletProvider from './WalletProvider';
import Footer from './components/Footer';
import Notifications from './components/Notifications';

const App = () => {
  return (
    <WalletProvider>
      <Router>
        <Header />
        <Notifications />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<UserProfile />} /> {/* Add profile route */}
        </Routes>
        <Footer />
      </Router>
    </WalletProvider>
  );
};

export default App;
