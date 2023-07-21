import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from './SignUp';

test('renders email and password inputs', () => {
  // Render the SignUp component
  render(<SignUp />);

  // Query the email and password inputs by their labels
  const emailInput = screen.getByLabelText('email');
  const passwordInput = screen.getByLabelText('password');

  // Assert that the inputs are present in the document
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
});

test('shows error message for invalid email format', () => { 
  render(<SignUp />);

  const emailInput = screen.getByPlaceholderText('Email...');
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

  const errorMessage = screen.getByText('Invalid email address');

  expect(errorMessage).toBeInTheDocument();
});

test('shows error message for invalid password format', () => {
  render(<SignUp />);

  const passwordInput = screen.getByPlaceholderText('Password...');
  fireEvent.change(passwordInput, { target: { value: 'invalid' } });

  const errorMessage = screen.getByText(
    'Password must contain at least 8 characters with at least one capital letter and one number'
  );

  expect(errorMessage).toBeInTheDocument();
});