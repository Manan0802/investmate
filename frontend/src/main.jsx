import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

/**
 * The Main component is the root of the React application.
 * It's responsible for setting up providers (like Auth) and applying the permanent dark theme.
 */
function Main() {
  // --- Permanent Dark Theme Effect ---
  // This effect runs only once when the application first loads.
  // It ensures the 'dark' class is always on the root <html> element.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []); // The empty dependency array ensures this runs only once.

  return (
    <React.StrictMode>
      <AuthProvider>
        <BrowserRouter>
          {/* The theme and setTheme props are no longer needed. */}
          <App />
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  );
}

// Renders the main application into the DOM.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
