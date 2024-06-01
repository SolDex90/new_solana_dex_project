import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Wallet from './pages/Wallet';
import Dashboard from './pages/Dashboard';
import UserProfile from './components/UserProfile';
import WalletProvider from './WalletProvider';
import Footer from './components/Footer';
import Notifications from './components/Notifications';
import ThemeToggle from './components/ThemeToggle';
import News from './components/News';

const App = () => {
  return (
    <WalletProvider>
      <Router>
        <Header />
        <ThemeToggle />
        <Notifications />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/news" element={<News />} />
        </Routes>
        <Footer />
      </Router>
    </WalletProvider>
  );
};

export default App;
