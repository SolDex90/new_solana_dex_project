import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Correct import path for jest-dom
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Mock the WalletMultiButton since it's an external component
jest.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <div>Mock Wallet Button</div>,
}));

describe('Header Component', () => {
  test('renders the header with the correct title', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const headerElement = screen.getByText('Solana DEX');
    expect(headerElement).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const homeLink = screen.getByText('Home');
    const tradeLink = screen.getByText('Trade');
    const walletLink = screen.getByText('Wallet');
    const dashboardLink = screen.getByText('Dashboard');
    const tradingDashboardLink = screen.getByText('Trading Dashboard');

    expect(homeLink).toBeInTheDocument();
    expect(tradeLink).toBeInTheDocument();
    expect(walletLink).toBeInTheDocument();
    expect(dashboardLink).toBeInTheDocument();
    expect(tradingDashboardLink).toBeInTheDocument();
  });

  test('renders the wallet button', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const walletButton = screen.getByText('Mock Wallet Button');
    expect(walletButton).toBeInTheDocument();
  });
});
