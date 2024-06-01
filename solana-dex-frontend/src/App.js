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
import Alerts from './components/Alerts';
import APIIntegration from './components/APIIntegration';
import Backtest from './components/Backtest';
import Chat from './components/Chat';
import CustomizableDashboard from './components/CustomizableDashboard';
import HelpCenter from './components/HelpCenter';
import LanguageSelector from './components/LanguageSelector';
import OrderBook from './components/OrderBook';
import Portfolio from './components/Portfolio';
import ReferralProgram from './components/ReferralProgram';
import Staking from './components/Staking';
import StopLossOrder from './components/StopLossOrder';
import TokenSwap from './components/TokenSwap';
import TradingHistory from './components/TradingHistory';
import UserActivity from './components/UserActivity';
import UserSettings from './components/UserSettings';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider

const App = () => {
  return (
    <WalletProvider>
      <ThemeProvider>
        <Router>
          <Header />
          <ThemeToggle /> {/* ThemeToggle should be inside the ThemeProvider */}
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
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/api-integration" element={<APIIntegration />} />
            <Route path="/backtest" element={<Backtest />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/custom-dashboard" element={<CustomizableDashboard />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/language-selector" element={<LanguageSelector />} />
            <Route path="/order-book" element={<OrderBook />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/referral" element={<ReferralProgram />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/stop-loss-order" element={<StopLossOrder />} />
            <Route path="/token-swap" element={<TokenSwap />} />
            <Route path="/trading-history" element={<TradingHistory />} />
            <Route path="/activity" element={<UserActivity />} />
            <Route path="/settings" element={<UserSettings />} />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </WalletProvider>
  );
};

export default App;
