// src/components/SignIn.test.js

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SignIn from './SignIn';
import { GlobalProvider } from '../contexts/GlobalStateContext';
import { ToastContainer } from 'react-toastify';

test('renders SignIn form and submits correctly', () => {
  render(
    <GlobalProvider>
      <SignIn />
      <ToastContainer />
    </GlobalProvider>
  );

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByText(/submit/i));

  expect(screen.getByText('Successfully signed in!')).toBeInTheDocument();
});
