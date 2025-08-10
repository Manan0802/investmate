// --- Imports ---
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import userService from '../services/UserService.js';
// Icons for a cleaner UI
import { X, Trash2 } from 'lucide-react';

/**
 * Editinvestment Component
 * A modal that allows users to edit the details of an existing investment purchase
 * and view or delete its associated sales records.
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to close the modal.
 * @param {object} props.investment - The investment object to be edited.
 * @param {function} props.onRefresh - Callback to refresh the data on the parent page.
 */
function Editinvestment({ isOpen, onClose, investment, onRefresh }) {
  // --- State Management ---
  const [formData, setFormData] = useState({ assetName: '', quantity: '', buyPrice: '', date: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State for the nested confirmation modal for deleting a sale.
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  // --- Hooks ---
  const { user } = useAuth();

  /**
   * `useEffect` hook to populate the form with the investment data
   * whenever a new `investment` prop is passed in.
   */
  useEffect(() => {
    if (investment) {
      setFormData({
        assetName: investment.assetName,
        quantity: investment.quantity,
        buyPrice: investment.buyPrice,
        date: new Date(investment.date).toISOString().split('T')[0],
      });
      // Reset error state when a new investment is loaded.
      setError('');
    }
  }, [investment]);

  // --- Event Handlers ---
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Handles the submission of the updated purchase details.
   */
  const handleUpdatePurchase = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await userService.updateInvestment(investment._id, formData, user.token);
      onRefresh(); // Refresh the parent component's data.
      onClose();   // Close the modal on success.
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update investment.';
      setError(message);
      console.error('Failed to update investment', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Opens the confirmation modal before deleting a sale record.
   */
  const handleDeleteSale = (sale) => {
    setSaleToDelete(sale);
    setIsConfirmOpen(true);
  };

  /**
   * Proceeds with deleting the sale record after confirmation.
   */
  const confirmDeleteSale = async () => {
    if (!saleToDelete) return;
    try {
      await userService.deleteSale(investment._id, saleToDelete._id, user.token);
      onRefresh(); // Refresh data to reflect the deleted sale.
    } catch (err) {
      console.error('Failed to delete sale', err);
      // Here you could set an error state specific to the sales section if needed.
    } finally {
      // Close the confirmation modal.
      setIsConfirmOpen(false);
      setSaleToDelete(null);
    }
  };

  // --- Style Definitions ---
  const labelStyle = "block text-sm font-medium text-slate-300";
  const inputStyle = "w-full px-4 py-2 mt-1 bg-slate-900 border border-slate-700 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  // If the modal is not open, render nothing.
  if (!isOpen) return null;

  return (
    // --- Modal Backdrop ---
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" aria-modal="true">
      {/* --- Modal Panel --- */}
      <div className="bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl border border-slate-700 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Edit Investment</h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-300 hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Purchase Form */}
          <form onSubmit={handleUpdatePurchase} className="space-y-4">
            <h3 className="text-md font-semibold text-blue-400">Original Purchase</h3>
            {error && <div className="p-3 text-center text-sm text-red-400 bg-red-500/10 rounded-md">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-assetName" className={labelStyle}>Asset Name</label>
                <input id="edit-assetName" type="text" name="assetName" value={formData.assetName} onChange={onChange} className={inputStyle} />
              </div>
              <div>
                <label htmlFor="edit-quantity" className={labelStyle}>Quantity</label>
                <input id="edit-quantity" type="number" step="any" name="quantity" value={formData.quantity} onChange={onChange} className={inputStyle} />
              </div>
              <div>
                <label htmlFor="edit-buyPrice" className={labelStyle}>Buy Price (₹)</label>
                <input id="edit-buyPrice" type="number" step="any" name="buyPrice" value={formData.buyPrice} onChange={onChange} className={inputStyle} />
              </div>
              <div>
                <label htmlFor="edit-date" className={labelStyle}>Purchase Date</label>
                <input id="edit-date" type="date" name="date" value={formData.date} onChange={onChange} className={inputStyle} />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm transition-all disabled:opacity-50">
                {isLoading ? 'Updating...' : 'Update Purchase'}
              </button>
            </div>
          </form>

          {/* Sales History Section */}
          <div className="space-y-4 border-t border-slate-700 pt-6">
            <h3 className="text-md font-semibold text-blue-400">Sales History</h3>
            {investment?.sales?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="p-2 text-left font-semibold">Units Sold</th>
                      <th className="p-2 text-right font-semibold">Sell Price</th>
                      <th className="p-2 text-center font-semibold">Date</th>
                      <th className="p-2 text-center font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {investment.sales.map((sale) => (
                      <tr key={sale._id} className="text-slate-300">
                        <td className="p-2">{sale.unitsSold}</td>
                        <td className="p-2 text-right">₹{sale.sellPrice.toLocaleString('en-IN')}</td>
                        <td className="p-2 text-center">{new Date(sale.date).toLocaleDateString('en-IN')}</td>
                        <td className="p-2 text-center">
                          <button onClick={() => handleDeleteSale(sale)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-full transition-colors" title="Delete Sale">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No sales recorded for this investment.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Nested Confirmation Modal for Deleting Sales */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeleteSale}
        title="Delete Sale Record"
        message={`Are you sure you want to delete this sale record? This action cannot be undone.`}
      />
    </div>
  );
}

/**
 * A reusable confirmation modal component, nested for use within the Editinvestment modal.
 */
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30" aria-modal="true">
      <div className="bg-slate-900 w-full max-w-sm p-6 rounded-2xl shadow-xl border border-slate-700">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-semibold bg-slate-800 hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Editinvestment;

