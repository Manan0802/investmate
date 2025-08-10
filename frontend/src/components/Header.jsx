// --- Imports ---
// useState: React hook to manage component-level state, used here for the mobile menu toggle.
import { useState } from 'react';
// NavLink: A special version of Link that knows whether or not it is "active", allowing for custom styling.
// useNavigate: Hook for programmatic navigation, used here to redirect after logout.
import { NavLink, useNavigate } from 'react-router-dom';
// useAuth: Custom hook to access authentication state (user) and functions (logout).
import { useAuth } from '../context/AuthContext.jsx';
// Icons: Clean and modern icons for the mobile menu. The theme icons (Sun, Moon) are removed.
import { Menu, X } from 'lucide-react';

/**
 * The Header component displays the main navigation bar for the permanent dark theme.
 * It is fully responsive, showing a hamburger menu on smaller screens.
 */
function Header() {
  // --- State Management ---
  // isMenuOpen: A boolean state to control the visibility of the mobile navigation menu.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Hooks ---
  // auth: Destructures the 'user' object and 'logout' function from our authentication context.
  const { user, logout } = useAuth();
  // navigate: Initializes the navigate function for programmatic redirects.
  const navigate = useNavigate();

  // --- Event Handlers ---
  /**
   * Handles the user logout process.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false); // Close mobile menu on logout
  };

  /**
   * Toggles the visibility of the mobile menu.
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // --- Style Definitions ---
  // Defines the classes for navigation links using default Tailwind dark colors.
  const navLinkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out ${
      isActive
        ? 'bg-slate-700 text-white' // Active link style
        : 'text-slate-300 hover:bg-slate-700 hover:text-white' // Inactive link style
    }`;

  return (
    // --- Header Container ---
    // VISUAL FIX: Using a pure black background as requested.
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-slate-800 shadow-sm">
      {/* --- Navigation Bar --- */}
      {/* LAYOUT FIX: Main nav container now uses justify-between for a three-part layout. */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between h-16">
        
        {/* Left Section: Brand/Logo */}
        <div className="flex-shrink-0">
          <NavLink to="/" className="text-2xl font-bold text-white" onClick={() => setIsMenuOpen(false)}>
            InvestMate
          </NavLink>
        </div>

        {/* Center Section: Main Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center justify-center flex-grow">
          {user && (
            <div className="flex items-baseline space-x-4">
              <NavLink to="/investments" className={navLinkClasses}>Investments</NavLink>
              <NavLink to="/analysis" className={navLinkClasses}>AI & Analysis</NavLink>
              <NavLink to="/market" className={navLinkClasses}>Market</NavLink>
              <NavLink to="/profile" className={navLinkClasses}>Profile</NavLink>
            </div>
          )}
        </div>

        {/* Right Section: Auth buttons (Desktop) & Mobile Menu Toggle */}
        <div className="flex items-center justify-end flex-shrink-0">
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <button onClick={handleLogout} className="py-2 px-3 rounded-md text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors duration-200">Logout</button>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClasses}>Login</NavLink>
                <NavLink to="/register" className="py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">Register</NavLink>
              </>
            )}
          </div>
          {/* Mobile Menu Button (Hamburger/X) */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-slate-300 hover:bg-slate-800 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Dropdown Menu --- */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-slate-800 bg-black">
          <div className="flex flex-col space-y-2">
            {user ? (
              <>
                <NavLink to="/investments" className={navLinkClasses} onClick={toggleMenu}>Investments</NavLink>
                <NavLink to="/analysis" className={navLinkClasses} onClick={toggleMenu}>AI & Analysis</NavLink>
                <NavLink to="/market" className={navLinkClasses} onClick={toggleMenu}>Market</NavLink>
                <NavLink to="/profile" className={navLinkClasses} onClick={toggleMenu}>Profile</NavLink>
                <button onClick={handleLogout} className="w-full text-left py-2 px-3 rounded-md text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClasses} onClick={toggleMenu}>Login</NavLink>
                <NavLink to="/register" className={navLinkClasses} onClick={toggleMenu}>Register</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
