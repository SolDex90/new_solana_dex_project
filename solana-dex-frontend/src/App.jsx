import React, { lazy, Suspense } from 'react'
import bgVideo from './images/background.mp4';

// provider
import WalletProvider from './WalletProvider/WalletProvider';
import { GlobalProvider } from './contexts/GlobalStateContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

// components
import Header from './components/Header';
//import Footer from './components/Footer';
//import ProtectedRoute from './components/ProtectedRoute';
//import BalanceChecker from './components/BalanceChecker'; // Import BalanceChecker
import './chartSetup'; // Import the chart setup file
import "@fontsource/space-grotesk"; // Defaults to weight 400

// Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// css
import './styles/theme.css'; // Import the theme styles
import './styles/styles.css'; // Ensure the global styles are imported

// Lazy load components
//const Trade = lazy(() => import('./pages/Trade'));
//const Wallet = lazy(() => import('./pages/Wallet'));
//const PortfolioPage = lazy(() => import('./components/PortfolioPage')); // Updated import path
//const UserProfile = lazy(() => import('./components/UserProfile'));
//const News = lazy(() => import('./components/News'));
//const TransactionHistory = lazy(() => import('./components/TransactionHistory'));
//const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
//const TradingDashboard = lazy(() => import('./components/TradingDashboard'));
//const SignIn = lazy(() => import('./components/SignIn'));
//const TrailingStopOrder = lazy(() => import('./components/TrailingStopOrder'));
//const ConditionalOrder = lazy(() => import('./components/ConditionalOrder'));
//const TradingBot = lazy(() => import('./components/TradingBot'));
//const AdvancedAnalytics = lazy(() => import('./components/AdvancedAnalytics'));
//const OrderNotifications = lazy(() => import('./components/OrderNotifications'));
//const PriceAlerts = lazy(() => import('./components/PriceAlerts'));
//const InteractiveTutorials = lazy(() => import('./components/InteractiveTutorials'));
//const SocialTrading = lazy(() => import('./components/SocialTrading'));
//const PortfolioManagement = lazy(() => import('./components/PortfolioManagement'));
//const ExampleChart = lazy(() => import('./components/ExampleChart'));
const LimitOrder = lazy(() => import('./components/LimitOrder'));
//const DCA = lazy(() => import('./components/DCA'));
//const Perps = lazy(() => import('./components/Perps'));
//const CustomizableDashboard = lazy(() => import('./components/CustomizableDashboard'));
const TokenSwap = lazy(() => import('./components/TokenSwap'));
//const TokenSniper = lazy(() => import('./pages/TokenSniper')); // Corrected import path
//const GamingPage = lazy(() => import('./components/GamingPage')); // Import the new GamingPage component
//const LendingPage = lazy(() => import('./components/LendingPage')); // Import the new LendingPage component
//const MusicPage = lazy(() => import('./components/MusicPage')); // Import the new MusicPage component
//const YieldFarmingPage = lazy(() => import('./components/YieldFarmingPage')); // Import the new YieldFarmingPage component
//const StakingPage = lazy(() => import('./components/StakingPage')); // Import the new StakingPage component
//const LiquidityPage = lazy(() => import('./components/LiquidityPage')); // Import the new LiquidityPage component
//const ComingSoon = lazy(() => import('./components/ComingSoon'));


function App() {

  return (
    <GlobalProvider>
      <WalletProvider>
        <ThemeProvider>
          <video autoPlay loop muted className="bg-vid">
            <source src={bgVideo} type="video/mp4" />
          </video>
          <Router>
            <Header/>
            <ErrorBoundary>
              <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                  <Route path="/" element={<Navigate to="/swap" />} />
                  <Route path="/swap" element={<TokenSwap />} />
                  <Route path="/limit-order" element={<LimitOrder />} />
                  {/*<Route path="/dca" element={<ComingSoon />} />
                  <Route path="/perps" element={<ComingSoon />} />
                  <Route path="/wallet" element={<ComingSoon />} />
                  <Route path="/portfolio" element={<ComingSoon />} />
                  <Route path="/profile" element={<ComingSoon />} />
                  <Route path="/news" element={<ComingSoon />} />
                  <Route path="/transactions" element={<ComingSoon />} />
                  <Route path="/analytics" element={<ComingSoon />} />
                  <Route path="/trading-dashboard" element={<ComingSoon />} />
                  <Route path="/signin" element={<ComingSoon />} />
                  <Route path="/trailing-stop-order" element={<ComingSoon />} />
                  <Route path="/conditional-order" element={<ComingSoon />} />
                  <Route path="/trading-bot" element={<ComingSoon />} />
                  <Route path="/advanced-analytics" element={<ComingSoon />} />
                  <Route path="/order-notifications" element={<ComingSoon />} />
                  <Route path="/price-alerts" element={<ComingSoon />} />
                  <Route path="/interactive-tutorials" element={<ComingSoon />} />
                  <Route path="/social-trading" element={<ComingSoon />} />
                  <Route path="/portfolio-management" element={<ComingSoon />} />
                  <Route path="/customizable-dashboard" element={<ComingSoon />} />
                  <Route path="/example-chart" element={<ComingSoon />} />
                  <Route path="/balance-checker" element={<ComingSoon />} />
                  <Route path="/token-sniper" element={<ComingSoon />} />
                  <Route path="/gaming" element={<ComingSoon />} />
                  <Route path="/lending" element={<ComingSoon />} />
                  <Route path="/music" element={<ComingSoon />} />
                  <Route path="/yield-farming" element={<ComingSoon />} />
                  <Route path="/staking" element={<ComingSoon />} />
                  <Route path="/liquidity" element={<ComingSoon />} />*/}
              </Routes>
              </Suspense>
            </ErrorBoundary>
          </Router>
        </ThemeProvider>
      </WalletProvider>
    </GlobalProvider>
  )
}

export default App