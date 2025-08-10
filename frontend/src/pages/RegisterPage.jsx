// --- Imports ---
// useState: Manages the form's input data, loading, and error states.
import { useState } from 'react';
// Link, useNavigate: For client-side navigation.
import { Link, useNavigate } from 'react-router-dom';
// userService: The service that contains the API call for registration.
import userService from '../services/UserService.js';

/**
 * RegisterPage Component
 * Provides a form for new users to create an account with their full name, email, and password.
 */
function RegisterPage() {
  // --- State Management ---
  // formData: Holds the user's input for the registration form.
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  // Destructuring for easier access in the form inputs.
  const { fullName, email, password } = formData;
  // isLoading: Tracks the submission process to provide user feedback (e.g., disable button).
  const [isLoading, setIsLoading] = useState(false);
  // error: Stores any error messages from the registration attempt to display to the user.
  const [error, setError] = useState('');

  // --- Hooks ---
  // navigate: Function to programmatically redirect the user after successful registration.
  const navigate = useNavigate();

  // --- Event Handlers ---
  /**
   * Updates the formData state as the user types in the input fields.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Handles the form submission for creating a new account.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevents the default browser refresh.
    setIsLoading(true); // Indicate that the process has started.
    setError('');       // Clear any previous errors.
    try {
      await userService.register(formData); // Call the registration API.
      // On success, navigate the user to the login page to sign in.
      navigate('/login');
    } catch (err) {
      // If registration fails, extract a user-friendly error message.
      const message =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(message); // Set the error message to be displayed in the UI.
      console.error('Registration failed:', message);
    } finally {
      setIsLoading(false); // Ensure the loading state is turned off, whether it succeeded or failed.
    }
  };

  return (
    // --- Main Container ---
    // Layout: Fills the available space and centers the content card, consistent with the login page.
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* --- Header Section --- */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Join InvestMate and take control of your financial future.
          </p>
        </div>

        {/* --- Registration Form --- */}
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

          {/* Full Name Input */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={onChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Email Input */}
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

          {/* Password Input */}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* --- Link to Login Page --- */}
        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
