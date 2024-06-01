import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';

test('renders Header component', () => {
  const { getByText } = render(<Header />);
  const linkElement = getByText(/Solana DEX/i);
  expect(linkElement).toBeInTheDocument();
});
