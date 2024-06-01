import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Notifications from './components/Notifications';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import WalletProvider from './WalletProvider';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Trade = lazy(() => import('./pages/Trade'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const News = lazy(() => import('./components/News'));
const TransactionHistory = lazy(() => import('./components/TransactionHistory'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const TradingDashboard = lazy(() => import('./components/TradingDashboard'));
const SignIn = lazy(() => import('./components/SignIn'));
const TrailingStopOrder = lazy(() => import('./components/TrailingStopOrder'));
const ConditionalOrder = lazy(() => import('./components/ConditionalOrder'));
const TradingBot = lazy(() => import('./components/TradingBot'));
const AdvancedAnalytics = lazy(() => import('./components/AdvancedAnalytics'));
const OrderNotifications = lazy(() => import('./components/OrderNotifications'));
const PriceAlerts = lazy(() => import('./components/PriceAlerts'));
const InteractiveTutorials = lazy(() => import('./components/InteractiveTutorials'));
const SocialTrading = lazy(() => import('./components/SocialTrading'));
const PortfolioManagement = lazy(() => import('./components/PortfolioManagement'));
const DraggableDashboard = lazy(() => import('./components/DraggableDashboard'));
const ExampleChart = lazy(() => import('./components/ExampleChart'));
const CryptoPrices = lazy(() => import('./components/CryptoPrices'));

const App = () => {
  return (
    <WalletProvider>
      <ThemeProvider>
        <Router>
          <Header />
          <ThemeToggle />
          <Notifications />
          <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
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
                <Route path="/crypto-prices" element={<CryptoPrices />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <Footer />
        </Router>
      </ThemeProvider>
    </WalletProvider>
  );
};

export default App;
