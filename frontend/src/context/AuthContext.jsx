import { createContext, useContext, useState } from 'react';
import userService from '../services/UserService.js';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage to keep user logged in on refresh
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  // Login function
  const login = async (userData) => {
    try {
      const response = await userService.login(userData);
      if (response) {
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(response));
        // Update user state
        setUser(response);
      }
      return response;
    } catch (error) {
      // Re-throw error to be caught by the component
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Provide state and functions to children
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};