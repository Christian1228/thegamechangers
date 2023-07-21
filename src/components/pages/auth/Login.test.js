import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('renders email and password inputs', () => {
    // Render the Login component
    render(<Login />);
  
    // Query the email and password inputs by their placeholders
    const emailInput = screen.getByPlaceholderText('Email...');
    const passwordInput = screen.getByPlaceholderText('Password...');
  
    // Assert that the inputs are present in the document
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
});

test("displays error message when login fails", async () => {
    // Mock the sign-in function to return an error
    signInWithEmailAndPassword.mockRejectedValue({ message: "Invalid email or password" });

    render(<Login />);
    fireEvent.change(screen.getByLabelText("email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    // Wait for the error message to be displayed
    const errorMessage = await screen.findByText("Invalid email or password");
    expect(errorMessage).toBeInTheDocument();
});

