// --- Imports ---
import { useState, useEffect } from 'react';
// Icons for a cleaner UI
import { X } from 'lucide-react';

/**
 * SellModal Component
 * A modal form for users to record a sale of a specific investment.
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to close the modal.
 * @param {function} props.onSaleSubmit - Callback to handle the submission of the sale data.
 * @param {object} props.investment - The investment being sold.
 * @param {number} props.remainingQty - The maximum quantity available to sell.
 */
function SellModal({ isOpen, onClose, onSaleSubmit, investment, remainingQty }) {
  // --- State Management ---
  const [formData, setFormData] = useState({
    unitsSold: '',
    sellPrice: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * `useEffect` hook to reset the form state and clear errors
   * whenever the modal is opened.
   */
  useEffect(() => {
    if (isOpen) {
      setFormData({
        unitsSold: '',
        sellPrice: '',
        date: new Date().toISOString().split('T')[0],
      });
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  // --- Event Handlers ---
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Handles the form submission.
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors.

    // Validation: Ensure the user doesn't sell more units than they own.
    if (parseFloat(formData.unitsSold) > remainingQty) {
      setError(`You cannot sell more than the remaining quantity of ${remainingQty}.`);
      return; // Stop the submission.
    }
    
    // Validation: Ensure units sold is a positive number.
    if (parseFloat(formData.unitsSold) <= 0) {
      setError('Units sold must be a positive number.');
      return;
    }

    setIsLoading(true);
    try {
      // The onSaleSubmit function is passed from the parent and handles the API call.
      await onSaleSubmit(investment._id, formData);
    } catch (err) {
      // If the parent's submit function throws an error, we can display it.
      setError(err.message || 'An unexpected error occurred.');
      setIsLoading(false); // Stop loading on error
    }
    // On success, the parent component will close the modal, so we don't need to set loading to false here.
  };

  // --- Style Definitions ---
  const labelStyle = "block text-sm font-medium text-slate-300";
  const inputStyle = "w-full px-4 py-2 mt-1 bg-slate-900 border border-slate-700 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  // Render nothing if the modal is not open.
  if (!isOpen) return null;

  return (
    // --- Modal Backdrop ---
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" aria-modal="true">
      {/* --- Modal Panel --- */}
      <div className="bg-slate-800 w-full max-w-md rounded-2xl shadow-xl border border-slate-700 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-white">Record Sale</h2>
            <p className="text-sm text-slate-400">
              For: <span className="font-medium text-blue-400">{investment?.assetName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Error Message Display */}
          {error && (
            <div className="p-3 text-center text-sm text-red-400 bg-red-500/10 rounded-md">
              {error}
            </div>
          )}
          
          {/* Informational Box */}
          <div className="p-3 bg-slate-900/50 rounded-md text-center">
            <p className="text-sm font-medium text-slate-300">
              Remaining Quantity: <span className="font-bold text-lg text-blue-400">{remainingQty}</span>
            </p>
          </div>

          {/* Form Fields */}
          <div>
            <label htmlFor="unitsSold" className={labelStyle}>Units Sold</label>
            <input id="unitsSold" type="number" step="any" min="0" name="unitsSold" value={formData.unitsSold} onChange={onChange} className={inputStyle} placeholder="e.g., 5" required />
          </div>
          <div>
            <label htmlFor="sellPrice" className={labelStyle}>Sell Price per Unit (₹)</label>
            <input id="sellPrice" type="number" step="any" min="0" name="sellPrice" value={formData.sellPrice} onChange={onChange} className={inputStyle} placeholder="e.g., 1650.75" required />
          </div>
          <div>
            <label htmlFor="saleDate" className={labelStyle}>Date of Sale</label>
            <input id="saleDate" type="date" name="date" value={formData.date} onChange={onChange} className={inputStyle} required />
          </div>

          {/* Modal Footer / Action Buttons */}
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-semibold bg-slate-700 hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50">
              {isLoading ? 'Confirming...' : 'Confirm Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SellModal;