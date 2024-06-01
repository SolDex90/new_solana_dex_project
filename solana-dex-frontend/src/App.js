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
import TrailingStopOrder from './components/TrailingStopOrder';
import ConditionalOrder from './components/ConditionalOrder';
import TradingBot from './components/TradingBot';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import OrderNotifications from './components/OrderNotifications';
import PriceAlerts from './components/PriceAlerts';
import InteractiveTutorials from './components/InteractiveTutorials';
import SocialTrading from './components/SocialTrading';
import PortfolioManagement from './components/PortfolioManagement';
import DraggableDashboard from './components/DraggableDashboard';
import ExampleChart from './components/ExampleChart';
import CryptoPrices from './components/CryptoPrices'; // Import CryptoPrices
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  return (
    <WalletProvider>
      <ThemeProvider>
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
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/trading-dashboard" element={<TradingDashboard />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/trailing-stop-order" element={<TrailingStopOrder />} />
            <Route path="/conditional-order" element={<ConditionalOrder />} />
            <Route path="/trading-bot" element={<TradingBot />} />
            <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
            <Route path="/order-notifications" element={<OrderNotifications />} />
            <Route path="/price-alerts" element={<PriceAlerts />} />
            <Route path="/interactive-tutorials" element={<InteractiveTutorials />} />
            <Route path="/social-trading" element={<SocialTrading />} />
            <Route path="/portfolio-management" element={<PortfolioManagement />} />
            <Route path="/draggable-dashboard" element={<DraggableDashboard />} />
            <Route path="/example-chart" element={<ExampleChart />} />
            <Route path="/crypto-prices" element={<CryptoPrices />} /> {/* Add CryptoPrices route */}
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </WalletProvider>
  );
};

export default App;
