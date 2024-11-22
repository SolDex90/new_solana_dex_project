import React, { lazy, Suspense } from 'react'
import bgVideo from './images/background.mp4';

// provider
import WalletProvider from './WalletProvider/WalletProvider';
import { GlobalProvider } from './contexts/GlobalStateContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

// components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import BalanceChecker from './components/BalanceChecker'; // Import BalanceChecker
import './chartSetup'; // Import the chart setup file
import "@fontsource/space-grotesk"; // Defaults to weight 400

// Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// css
import './styles/theme.css'; // Import the theme styles
import './styles/styles.css'; // Ensure the global styles are imported

// Lazy load components
const Trade = lazy(() => import('./pages/Trade'));
const Wallet = lazy(() => import('./pages/Wallet'));
const PortfolioPage = lazy(() => import('./components/PortfolioPage')); // Updated import path
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
const ExampleChart = lazy(() => import('./components/ExampleChart'));
const LimitOrder = lazy(() => import('./components/LimitOrder'));
const DCA = lazy(() => import('./components/DCA'));
const Perps = lazy(() => import('./components/Perps'));
const CustomizableDashboard = lazy(() => import('./components/CustomizableDashboard'));
const TokenSwap = lazy(() => import('./components/TokenSwap'));
const TokenSniper = lazy(() => import('./pages/TokenSniper')); // Corrected import path
const GamingPage = lazy(() => import('./components/GamingPage')); // Import the new GamingPage component
const LendingPage = lazy(() => import('./components/LendingPage')); // Import the new LendingPage component
const MusicPage = lazy(() => import('./components/MusicPage')); // Import the new MusicPage component
const YieldFarmingPage = lazy(() => import('./components/YieldFarmingPage')); // Import the new YieldFarmingPage component
const StakingPage = lazy(() => import('./components/StakingPage')); // Import the new StakingPage component
const LiquidityPage = lazy(() => import('./components/LiquidityPage')); // Import the new LiquidityPage component


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
                    <Route path="/" element={<Navigate to="/swap" />} /> {/* Redirect Home to Swap */}
                    <Route path="/swap" element={<TokenSwap />} />
                    <Route path="/trade" element={<Trade />} />
                    <Route path="/limit-order" element={<LimitOrder />} />
                    <Route path="/dca" element={<DCA />} />
                    <Route path="/perps" element={<Perps />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path="/news" element={<News />} />
                    <Route path="/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
                    <Route path="/trading-dashboard" element={<TradingDashboard />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/trailing-stop-order" element={<ProtectedRoute><TrailingStopOrder /></ProtectedRoute>} />
                    <Route path="/conditional-order" element={<ProtectedRoute><ConditionalOrder /></ProtectedRoute>} />
                    <Route path="/trading-bot" element={<ProtectedRoute><TradingBot /></ProtectedRoute>} />
                    <Route path="/advanced-analytics" element={<ProtectedRoute><AdvancedAnalytics /></ProtectedRoute>} />
                    <Route path="/order-notifications" element={<ProtectedRoute><OrderNotifications /></ProtectedRoute>} />
                    <Route path="/price-alerts" element={<ProtectedRoute><PriceAlerts /></ProtectedRoute>} />
                    <Route path="/interactive-tutorials" element={<ProtectedRoute><InteractiveTutorials /></ProtectedRoute>} />
                    <Route path="/social-trading" element={<ProtectedRoute><SocialTrading /></ProtectedRoute>} />
                    <Route path="/portfolio-management" element={<ProtectedRoute><PortfolioManagement /></ProtectedRoute>} />
                    <Route path="/customizable-dashboard" element={<ProtectedRoute><CustomizableDashboard /></ProtectedRoute>} />
                    <Route path="/example-chart" element={<ExampleChart />} />
                    <Route path="/balance-checker" element={<BalanceChecker />} /> {/* Add BalanceChecker route */}
                    <Route path="/token-sniper" element={<TokenSniper />} /> {/* Add TokenSniper route */}
                    <Route path="/gaming" element={<GamingPage />} /> {/* Add GamingPage route */}
                    <Route path="/lending" element={<LendingPage />} /> {/* Add LendingPage route */}
                    <Route path="/music" element={<MusicPage />} /> {/* Add MusicPage route */}
                    <Route path="/yield-farming" element={<YieldFarmingPage />} /> {/* Add YieldFarmingPage route */}
                    <Route path="/staking" element={<StakingPage />} /> {/* Add StakingPage route */}
                    <Route path="/liquidity" element={<LiquidityPage />} /> {/* Add LiquidityPage route */}
                    {/* <Route path="/crypto-prices" element={<CryptoPrices />} /> */}
                </Routes>
              </Suspense>
            </ErrorBoundary>
            <Footer />
          </Router>
        </ThemeProvider>
      </WalletProvider>
    </GlobalProvider>
  )
}

export default App
