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
import TransactionHistory from './components/TransactionHistory';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TradingDashboard from './components/TradingDashboard';
import SignIn from './components/SignIn';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider

const App = () => {
  return (
    <WalletProvider>
      <ThemeProvider>
        <Router>
          <Header />
          <ThemeToggle /> {/* Add ThemeToggle component */}
          <Notifications />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/news" element={<News />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/trading-dashboard" element={<TradingDashboard />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </WalletProvider>
  );
};

export default App;
