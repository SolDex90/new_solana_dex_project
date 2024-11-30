import React, { lazy, Suspense } from "react";
import bgVideo from "./images/background.mp4";

// provider
import WalletProvider from "./WalletProvider/WalletProvider";
import { GlobalProvider } from "./contexts/GlobalStateContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";

// components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import BalanceChecker from "./components/BalanceChecker";
import "./chartSetup";
import "@fontsource/space-grotesk";

// Router
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// CSS
import "./styles/theme.css";
import "./styles/styles.css";

// Lazy load components
const Trade = lazy(() => import("./pages/Trade.jsx"));
const Wallet = lazy(() => import("./pages/Wallet.jsx"));
const PortfolioPage = lazy(() => import("./components/PortfolioPage.jsx"));
const UserProfile = lazy(() => import("./components/UserProfile.jsx"));
const News = lazy(() => import("./components/News.jsx"));
const TransactionHistory = lazy(() => import("./components/TransactionHistory.jsx"));
const AnalyticsDashboard = lazy(() => import("./components/AnalyticsDashboard.jsx"));
const TradingDashboard = lazy(() => import("./components/TradingDashboard.jsx"));
const SignIn = lazy(() => import("./components/SignIn.jsx"));
const TrailingStopOrder = lazy(() => import("./components/TrailingStopOrder.jsx"));
const ConditionalOrder = lazy(() => import("./components/ConditionalOrder.jsx"));
const TradingBot = lazy(() => import("./components/TradingBot.jsx"));
const AdvancedAnalytics = lazy(() => import("./components/AdvancedAnalytics.jsx"));
const OrderNotifications = lazy(() => import("./components/OrderNotifications.jsx"));
const PriceAlerts = lazy(() => import("./components/PriceAlerts.jsx"));
const InteractiveTutorials = lazy(() => import("./components/InteractiveTutorials.jsx"));
const SocialTrading = lazy(() => import("./components/SocialTrading.jsx"));
const PortfolioManagement = lazy(() => import("./components/PortfolioManagement.jsx"));
const ExampleChart = lazy(() => import("./components/ExampleChart.jsx"));
const LimitOrder = lazy(() => import("./components/LimitOrder.jsx"));
const DCA = lazy(() => import("./components/DCA.jsx"));
const Perps = lazy(() => import("./components/Perps.jsx"));
const CustomizableDashboard = lazy(() => import("./components/CustomizableDashboard.jsx"));
const TokenSwap = lazy(() => import("./components/TokenSwap.jsx"));
const TokenSniper = lazy(() => import("./pages/TokenSniper.jsx"));
const GamingPage = lazy(() => import("./components/GamingPage.jsx"));
const LendingPage = lazy(() => import("./components/LendingPage.jsx"));
const MusicPage = lazy(() => import("./components/MusicPage.jsx"));
const YieldFarmingPage = lazy(() => import("./components/YieldFarmingPage.jsx"));
const StakingPage = lazy(() => import("./components/StakingPage.jsx"));
const LiquidityPage = lazy(() => import("./components/LiquidityPage.jsx"));

function App() {
  return (
    <GlobalProvider>
      <WalletProvider>
        <ThemeProvider>
          <video autoPlay loop muted className="bg-vid">
            <source src={bgVideo} type="video/mp4" />
          </video>
          <Router>
            <Header />
            <ErrorBoundary>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Navigate to="/swap" />} />
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
                  <Route path="/balance-checker" element={<BalanceChecker />} />
                  <Route path="/token-sniper" element={<TokenSniper />} />
                  <Route path="/gaming" element={<GamingPage />} />
                  <Route path="/lending" element={<LendingPage />} />
                  <Route path="/music" element={<MusicPage />} />
                  <Route path="/yield-farming" element={<YieldFarmingPage />} />
                  <Route path="/staking" element={<StakingPage />} />
                  <Route path="/liquidity" element={<LiquidityPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
            <Footer />
          </Router>
        </ThemeProvider>
      </WalletProvider>
    </GlobalProvider>
  );
}

export default App;
