// --- Imports ---
// useState: Manages the form's input data.
import { useState } from 'react';
// Link, useNavigate: For client-side navigation without page reloads.
import { Link, useNavigate } from 'react-router-dom';
// useAuth: Custom hook to access the login function from our AuthContext.
import { useAuth } from '../context/AuthContext.jsx';

// --- EDIT START ---
// Get the backend URL from the environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// --- EDIT END ---

/**
 * LoginPage Component
 * Provides a form for users to log in using their email and password,
 * or alternatively, via Google OAuth.
 */
function LoginPage() {
  // --- State Management ---
  // formData: A state object to hold the values of the email and password fields.
  const [formData, setFormData] = useState({ email: '', password: '' });
  // Destructuring for easier access in the form inputs.
  const { email, password } = formData;
  // State for handling loading and error messages.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Hooks ---
  // login: The login function destructured from our authentication context.
  const { login } = useAuth();
  // navigate: Function to programmatically redirect the user after a successful login.
  const navigate = useNavigate();

  // --- Event Handlers ---
  /**
   * Updates the formData state whenever a user types in an input field.
   * It uses the input's 'name' attribute to update the corresponding key in the state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Handles the form submission for email/password login.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevents the default browser refresh on form submission.
    setIsLoading(true); // Set loading state to true.
    setError(''); // Clear any previous errors.
    try {
      await login(formData); // Calls the login function from AuthContext.
      navigate('/investments'); // On success, redirects to the main investments page.
    } catch (err) {
      // If login fails, extract a user-friendly error message.
      const message = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(message);
      console.error('Login failed:', message);
      setIsLoading(false); // Reset loading state.
    }
  };

  /**
   * Initiates the Google OAuth login flow by redirecting the user.
   */
  const handleGoogleLogin = () => {
    // --- EDIT START ---
    // This URL now points to your backend's Google authentication route using the environment variable.
    window.open(`${BACKEND_URL}/auth/google`, '_self');
    // --- EDIT END ---
  };

  return (
    // --- Main Container ---
    // Layout: Fills the available space and centers the content card. Inherits dark background.
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* --- Header Section --- */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Welcome back to InvestMate!
          </p>
        </div>

        {/* --- Login Form --- */}
        {/* VISUAL FIX: Using default dark colors for the form card. */}
        <form
          onSubmit={onSubmit}
          className="bg-slate-800 p-8 space-y-6 border border-slate-700 rounded-2xl shadow-lg"
        >
          {/* Error Message Display */}
          {error && (
            <div className="p-3 text-center text-sm text-red-400 bg-red-500/10 rounded-md">
              {error}
            </div>
          )}

          {/* Email Input Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Password Input Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* --- Divider --- */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-2 text-slate-400">OR</span>
          </div>
        </div>

        {/* --- Google Login Button --- */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-md transition-colors shadow-sm border border-slate-700"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/24px-Google_%22G%22_logo.svg.png" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>

        {/* --- Link to Register Page --- */}
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
