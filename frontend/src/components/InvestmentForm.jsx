// --- Imports ---
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import userService from '../services/UserService.js';

/**
 * InvestmentForm Component
 * A form used to add a new investment entry to the user's portfolio.
 * It's designed to be used within other pages, like the main InvestmentsPage.
 * @param {object} props - The component's props.
 * @param {function} props.onInvestmentAdded - A callback function to be executed after an investment is successfully added.
 */
function InvestmentForm({ onInvestmentAdded }) {
  // --- State Management ---
  // A single state object to manage all form fields.
  const [formData, setFormData] = useState({
    assetType: 'Stocks',
    assetName: '',
    quantity: '',
    buyPrice: '',
    // Sets the default date to today in YYYY-MM-DD format.
    date: new Date().toISOString().split('T')[0],
  });
  // isLoading state to provide feedback during form submission.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Hooks ---
  const { user } = useAuth(); // Access the authenticated user's token.

  // --- Event Handlers ---
  /**
   * A generic handler that updates the formData state as the user types.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event from an input or select field.
   */
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Handles the form submission process.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser refresh.
    setIsLoading(true); // Disable the button and show loading state.
    setError('');       // Clear previous errors.
    try {
      await userService.addInvestment(formData, user.token);
      onInvestmentAdded(); // Trigger the callback to refresh the parent component's data.
      // Reset the form to its initial state for the next entry.
      setFormData({
        assetType: 'Stocks',
        assetName: '',
        quantity: '',
        buyPrice: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add investment. Please check the details.';
      setError(message);
      console.error('Failed to add investment', err);
    } finally {
      setIsLoading(false); // Re-enable the button.
    }
  };

  // --- Style Definitions ---
  // Centralizing styles for form elements to keep JSX clean and maintain consistency for the dark theme.
  const labelStyle = "block text-sm font-medium text-slate-300";
  const inputStyle = "w-full px-4 py-2 mt-1 bg-slate-900 border border-slate-700 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    // The form no longer has its own outer container, as it's embedded within a parent card.
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-white">New Investment Details</h3>
      
      {/* Error Message Display */}
      {error && (
        <div className="p-3 text-center text-sm text-red-400 bg-red-500/10 rounded-md">
          {error}
        </div>
      )}

      {/* --- Form Grid --- */}
      {/* A responsive grid that adapts from a single column to multiple columns on larger screens. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Asset Type Select */}
        <div>
          <label htmlFor="assetType" className={labelStyle}>Asset Type</label>
          <select
            id="assetType"
            name="assetType"
            value={formData.assetType}
            onChange={onChange}
            className={inputStyle}
          >
            <option>Stocks</option>
            <option>Crypto</option>
            <option>Real Estate</option>
            <option>Other</option>
          </select>
        </div>

        {/* Asset Name Input */}
        <div>
          <label htmlFor="assetName" className={labelStyle}>Asset Name</label>
          <input
            type="text"
            id="assetName"
            name="assetName"
            value={formData.assetName}
            onChange={onChange}
            placeholder="e.g., RELIANCE.NS or Bitcoin"
            className={inputStyle}
            required
          />
        </div>

        {/* Quantity Input */}
        <div>
          <label htmlFor="quantity" className={labelStyle}>Quantity</label>
          <input
            type="number"
            id="quantity"
            step="any" // Allows for fractional quantities (e.g., for crypto).
            min="0"
            name="quantity"
            value={formData.quantity}
            onChange={onChange}
            placeholder="e.g., 10"
            className={inputStyle}
            required
          />
        </div>

        {/* Buy Price Input */}
        <div>
          <label htmlFor="buyPrice" className={labelStyle}>Buy Price (₹)</label>
          <input
            type="number"
            id="buyPrice"
            step="any"
            min="0"
            name="buyPrice"
            value={formData.buyPrice}
            onChange={onChange}
            placeholder="e.g., 1500.50"
            className={inputStyle}
            required
          />
        </div>

        {/* Purchase Date Input */}
        <div>
          <label htmlFor="date" className={labelStyle}>Purchase Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            className={inputStyle}
            required
          />
        </div>
      </div>
      
      {/* --- Submit Button --- */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-md shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Investment'}
        </button>
      </div>
    </form>
  );
}

export default InvestmentForm;