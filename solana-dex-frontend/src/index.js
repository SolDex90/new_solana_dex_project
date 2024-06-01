import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/styles.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import ErrorBoundary from './components/ErrorBoundary'; // Ensure this import is correct

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
