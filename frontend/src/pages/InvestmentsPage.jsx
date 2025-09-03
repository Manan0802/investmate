// // --- Imports ---
// import { useEffect, useState, useCallback, useMemo } from 'react';
// import { useAuth } from '../context/AuthContext.jsx';
// import userService from '../services/UserService.js';
// // Child Components
// import InvestmentForm from '../components/InvestmentForm.jsx';
// import Editinvestment from '../components/Editinvestment.jsx';
// import SellModal from '../components/SellModal.jsx';
// // Icons for a cleaner UI
// import { Trash2, Edit, DollarSign, ChevronDown, PlusCircle } from 'lucide-react';

// // --- Constants ---
// // Filter options for the investment types.
// const FILTERS = ['Overall', 'Stocks', 'Crypto', 'Real Estate', 'Other'];

// // --- Main Page Component ---
// function InvestmentsPage() {
//   // --- State Management ---
//   const [investments, setInvestments] = useState([]);
//   const [livePrices, setLivePrices] = useState({});
//   const [activeFilter, setActiveFilter] = useState('Overall');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isFormVisible, setIsFormVisible] = useState(false);

//   // State for the Edit Modal
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentInvestment, setCurrentInvestment] = useState(null);

//   // State for the Sell Modal
//   const [isSellModalOpen, setIsSellModalOpen] = useState(false);
//   const [investmentToSell, setInvestmentToSell] = useState(null);

//   // State for the Confirmation Modal (replaces window.confirm)
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [investmentToDelete, setInvestmentToDelete] = useState(null);
  
//   // --- Hooks ---
//   const { user } = useAuth(); // Access user data, including the auth token.

//   /**
//    * `useCallback` memoizes the `fetchData` function to prevent it from being
//    * recreated on every render, which is crucial for performance as it's a
//    * dependency of the main `useEffect` hook.
//    */
//   const fetchData = useCallback(async () => {
//     if (!user?.token) return;
//     setIsLoading(true);
//     try {
//       const baseInvestments = await userService.getInvestments(user.token);
//       const pricePromises = baseInvestments.map(inv => {
//         if (inv.assetType === 'Stocks') return userService.getStockPrice(inv.assetName, user.token);
//         if (inv.assetType === 'Crypto') return userService.getCryptoPrice(inv.assetName.toLowerCase(), user.token);
//         return Promise.resolve(null);
//       });
//       const priceResults = await Promise.allSettled(pricePromises);
//       const prices = {};
//       baseInvestments.forEach((inv, index) => {
//         const result = priceResults[index];
//         if (result.status === 'fulfilled' && result.value) {
//           if (inv.assetType === 'Stocks' && result.value.price) {
//             prices[inv.assetName.toUpperCase()] = result.value.price;
//           } else if (inv.assetType === 'Crypto') {
//             const cryptoId = Object.keys(result.value)[0];
//             if (cryptoId && result.value[cryptoId]?.inr) {
//               prices[cryptoId.toLowerCase()] = result.value[cryptoId].inr;
//             }
//           }
//         }
//       });
//       setInvestments(baseInvestments);
//       setLivePrices(prices);
//     } catch (error) {
//       console.error('Failed to fetch investment or price data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user]);

//   // Main effect hook to fetch data when the component mounts.
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   /**
//    * `useMemo` memoizes the filtered list of investments, recalculating only
//    * when the `investments` array or `activeFilter` changes.
//    */
//   const filteredInvestments = useMemo(() => {
//     if (activeFilter === 'Overall') return investments;
//     return investments.filter((inv) => inv.assetType === activeFilter);
//   }, [investments, activeFilter]);

//   // --- Event Handlers ---
//   const handleDelete = (investment) => {
//     setInvestmentToDelete(investment);
//     setIsConfirmModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!investmentToDelete) return;
//     try {
//       await userService.deleteInvestment(investmentToDelete._id, user.token);
//       fetchData();
//     } catch (error) {
//       console.error('Delete failed:', error);
//     } finally {
//       setIsConfirmModalOpen(false);
//       setInvestmentToDelete(null);
//     }
//   };

//   const handleOpenEditModal = (investment) => {
//     setCurrentInvestment(investment);
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setCurrentInvestment(null);
//   };

//   const handleOpenSellModal = (investment) => {
//     setInvestmentToSell(investment);
//     setIsSellModalOpen(true);
//   };

//   const handleCloseSellModal = () => {
//     setIsSellModalOpen(false);
//     setInvestmentToSell(null);
//   };

//   const remainingQtyForModal = useMemo(() => {
//     if (!investmentToSell) return 0;
//     const totalSold = (investmentToSell.sales || []).reduce((acc, sale) => acc + sale.unitsSold, 0);
//     return investmentToSell.quantity - totalSold;
//   }, [investmentToSell]);

//   return (
//     <div className="space-y-8 p-4 sm:p-6 lg:p-8">
//       {/* --- Page Header --- */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-white">My Investments</h1>
//           <p className="mt-1 text-slate-400">Your central hub for tracking all assets.</p>
//         </div>
//         <button
//           onClick={() => setIsFormVisible(!isFormVisible)}
//           className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-300"
//         >
//           <PlusCircle size={20} />
//           <span>{isFormVisible ? 'Close Form' : 'Add Investment'}</span>
//           <ChevronDown size={20} className={`transition-transform duration-300 ${isFormVisible ? 'rotate-180' : ''}`} />
//         </button>
//       </div>

//       {/* --- Investment Form (Collapsible) --- */}
//       {isFormVisible && (
//         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
//           <InvestmentForm onInvestmentAdded={() => {
//             fetchData();
//             setIsFormVisible(false);
//           }} />
//         </div>
//       )}

//       {/* --- Main Content Card (Filters & Table) --- */}
//       <div className="bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-sm">
//         <h2 className="text-xl font-semibold mb-4 text-white">Portfolio Entries</h2>
        
//         {/* Filter Buttons */}
//         <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-4">
//           {FILTERS.map((filter) => (
//             <button
//               key={filter}
//               onClick={() => setActiveFilter(filter)}
//               className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 ${
//                 activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//               }`}
//             >
//               {filter}
//             </button>
//           ))}
//         </div>

//         {/* --- Data Table --- */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
//               <tr>
//                 <th className="p-3 text-left font-semibold">Asset</th>
//                 <th className="p-3 text-right font-semibold">Quantity</th>
//                 <th className="p-3 text-right font-semibold">Buy Price</th>
//                 <th className="p-3 text-right font-semibold">Invested</th>
//                 <th className="p-3 text-center font-semibold">Date</th>
//                 <th className="p-3 text-right font-semibold">Live Price</th>
//                 <th className="p-3 text-center font-semibold">Remaining</th>
//                 <th className="p-3 text-right font-semibold">Net P/L</th>
//                 <th className="p-3 text-center font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-700">
//               {isLoading ? (
//                 <tr><td colSpan="9" className="text-center p-8 text-slate-400">Loading investments...</td></tr>
//               ) : filteredInvestments.length > 0 ? (
//                 filteredInvestments.map(inv => {
//                   const invested = (inv.quantity || 0) * (inv.buyPrice || 0);
//                   const livePrice = livePrices[inv.assetName.toUpperCase()] || livePrices[inv.assetName.toLowerCase()];
//                   const showLivePrice = inv.assetType === 'Stocks' || inv.assetType === 'Crypto';
//                   const totalSold = (inv.sales || []).reduce((acc, s) => acc + s.unitsSold, 0);
//                   const remainingQty = inv.quantity - totalSold;
//                   const netPL = (inv.sales || []).reduce((acc, s) => acc + ((s.sellPrice - inv.buyPrice) * s.unitsSold), 0);

//                   return (
//                     <tr key={inv._id} className="hover:bg-slate-700/50 transition-colors">
//                       <td className="p-3 font-medium text-white">
//                         {inv.assetName}
//                         <div className="text-xs text-slate-400">{inv.assetType}</div>
//                       </td>
//                       <td className="p-3 text-right text-slate-300">{inv.quantity}</td>
//                       <td className="p-3 text-right text-slate-300">₹{inv.buyPrice?.toLocaleString('en-IN')}</td>
//                       <td className="p-3 text-right text-slate-300">₹{invested.toLocaleString('en-IN')}</td>
//                       <td className="p-3 text-center text-slate-400">{new Date(inv.date).toLocaleDateString('en-IN')}</td>
//                       <td className="p-3 text-right font-semibold text-cyan-400">
//                         {showLivePrice ? (livePrice ? `₹${Number(livePrice).toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : 'N/A') : '-'}
//                       </td>
//                       <td className="p-3 text-center font-bold text-white">{remainingQty}</td>
//                       <td className={`p-3 text-right font-bold ${netPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                         {(inv.sales?.length || 0) > 0 ? `₹${netPL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : '-'}
//                       </td>
//                       <td className="p-3 text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           <button onClick={() => handleOpenSellModal(inv)} className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-full transition-colors" title="Sell"><DollarSign size={16} /></button>
//                           <button onClick={() => handleOpenEditModal(inv)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors" title="Edit"><Edit size={16} /></button>
//                           <button onClick={() => handleDelete(inv)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-full transition-colors" title="Delete"><Trash2 size={16} /></button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr><td colSpan="9" className="text-center p-8 text-slate-400">No investments found for this category.</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- Modals --- */}
//       <Editinvestment isOpen={isEditModalOpen} onClose={handleCloseEditModal} investment={currentInvestment} onRefresh={fetchData} />
//       <SellModal isOpen={isSellModalOpen} onClose={handleCloseSellModal} investment={investmentToSell} onSaleSubmit={async (investmentId, saleData) => {
//           try {
//             await userService.addSale(investmentId, saleData, user.token);
//             handleCloseSellModal();
//             fetchData();
//           } catch (error) {
//             console.error('Sale failed:', error);
//           }
//         }} remainingQty={remainingQtyForModal} />
//       <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmDelete} title="Delete Investment" message={`Are you sure you want to permanently delete the investment in ${investmentToDelete?.assetName}? This action cannot be undone.`} />
//     </div>
//   );
// }

// /**
//  * A reusable confirmation modal component.
//  */
// function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" aria-modal="true">
//       <div className="bg-slate-800 w-full max-w-md p-6 rounded-2xl shadow-xl border border-slate-700">
//         <h3 className="text-lg font-bold text-white">{title}</h3>
//         <p className="mt-2 text-sm text-slate-400">{message}</p>
//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-md text-sm font-semibold bg-slate-700 hover:bg-slate-600 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default InvestmentsPage;
// --- Imports ---
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import userService from '../services/UserService.js';
// Child Components
import InvestmentForm from '../components/InvestmentForm.jsx';
import Editinvestment from '../components/Editinvestment.jsx';
import SellModal from '../components/SellModal.jsx';
// Icons for a cleaner UI
import { Trash2, Edit, DollarSign, ChevronDown, PlusCircle } from 'lucide-react';

// --- Constants ---
// Filter options for the investment types.
const FILTERS = ['Overall', 'Stocks', 'Crypto', 'Real Estate', 'Other'];

// --- Main Page Component ---
function InvestmentsPage() {
  // --- State Management ---
  const [investments, setInvestments] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [activeFilter, setActiveFilter] = useState('Overall');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // State for the Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentInvestment, setCurrentInvestment] = useState(null);

  // State for the Sell Modal
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [investmentToSell, setInvestmentToSell] = useState(null);

  // State for the Confirmation Modal (replaces window.confirm)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState(null);
  
  // --- Hooks ---
  const { user } = useAuth(); // Access user data, including the auth token.

  /**
   * `useCallback` memoizes the `fetchData` function to prevent it from being
   * recreated on every render, which is crucial for performance as it's a
   * dependency of the main `useEffect` hook.
   */
  const fetchData = useCallback(async () => {
    if (!user?.token) return;
    setIsLoading(true);
    try {
      const baseInvestments = await userService.getInvestments(user.token);
      const pricePromises = baseInvestments.map(inv => {
        if (inv.assetType === 'Stocks') return userService.getStockPrice(inv.assetName, user.token);
        if (inv.assetType === 'Crypto') return userService.getCryptoPrice(inv.assetName.toLowerCase(), user.token);
        return Promise.resolve(null);
      });
      const priceResults = await Promise.allSettled(pricePromises);
      const prices = {};
      baseInvestments.forEach((inv, index) => {
        const result = priceResults[index];
        if (result.status === 'fulfilled' && result.value) {
          if (inv.assetType === 'Stocks' && result.value.price) {
            prices[inv.assetName.toUpperCase()] = result.value.price;
          } else if (inv.assetType === 'Crypto') {
            const cryptoId = Object.keys(result.value)[0];
            // --- EDIT #1: Look for 'usd' instead of 'inr' ---
            if (cryptoId && result.value[cryptoId]?.usd) {
              prices[cryptoId.toLowerCase()] = result.value[cryptoId].usd;
            }
          }
        }
      });
      setInvestments(baseInvestments);
      setLivePrices(prices);
    } catch (error) {
      console.error('Failed to fetch investment or price data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Main effect hook to fetch data when the component mounts.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * `useMemo` memoizes the filtered list of investments, recalculating only
   * when the `investments` array or `activeFilter` changes.
   */
  const filteredInvestments = useMemo(() => {
    if (activeFilter === 'Overall') return investments;
    return investments.filter((inv) => inv.assetType === activeFilter);
  }, [investments, activeFilter]);

  // --- Event Handlers ---
  const handleDelete = (investment) => {
    setInvestmentToDelete(investment);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!investmentToDelete) return;
    try {
      await userService.deleteInvestment(investmentToDelete._id, user.token);
      fetchData();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsConfirmModalOpen(false);
      setInvestmentToDelete(null);
    }
  };

  const handleOpenEditModal = (investment) => {
    setCurrentInvestment(investment);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentInvestment(null);
  };

  const handleOpenSellModal = (investment) => {
    setInvestmentToSell(investment);
    setIsSellModalOpen(true);
  };

  const handleCloseSellModal = () => {
    setIsSellModalOpen(false);
    setInvestmentToSell(null);
  };

  const remainingQtyForModal = useMemo(() => {
    if (!investmentToSell) return 0;
    const totalSold = (investmentToSell.sales || []).reduce((acc, sale) => acc + sale.unitsSold, 0);
    return investmentToSell.quantity - totalSold;
  }, [investmentToSell]);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* --- Page Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Investments</h1>
          <p className="mt-1 text-slate-400">Your central hub for tracking all assets.</p>
        </div>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-300"
        >
          <PlusCircle size={20} />
          <span>{isFormVisible ? 'Close Form' : 'Add Investment'}</span>
          <ChevronDown size={20} className={`transition-transform duration-300 ${isFormVisible ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* --- Investment Form (Collapsible) --- */}
      {isFormVisible && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
          <InvestmentForm onInvestmentAdded={() => {
            fetchData();
            setIsFormVisible(false);
          }} />
        </div>
      )}

      {/* --- Main Content Card (Filters & Table) --- */}
      <div className="bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-white">Portfolio Entries</h2>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-4">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 ${
                activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* --- Data Table --- */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
              <tr>
                <th className="p-3 text-left font-semibold">Asset</th>
                <th className="p-3 text-right font-semibold">Quantity</th>
                <th className="p-3 text-right font-semibold">Buy Price</th>
                <th className="p-3 text-right font-semibold">Invested</th>
                <th className="p-3 text-center font-semibold">Date</th>
                <th className="p-3 text-right font-semibold">Live Price</th>
                <th className="p-3 text-center font-semibold">Remaining</th>
                <th className="p-3 text-right font-semibold">Net P/L</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {isLoading ? (
                <tr><td colSpan="9" className="text-center p-8 text-slate-400">Loading investments...</td></tr>
              ) : filteredInvestments.length > 0 ? (
                filteredInvestments.map(inv => {
                  const invested = (inv.quantity || 0) * (inv.buyPrice || 0);
                  const livePrice = livePrices[inv.assetName.toUpperCase()] || livePrices[inv.assetName.toLowerCase()];
                  const showLivePrice = inv.assetType === 'Stocks' || inv.assetType === 'Crypto';
                  const totalSold = (inv.sales || []).reduce((acc, s) => acc + s.unitsSold, 0);
                  const remainingQty = inv.quantity - totalSold;
                  const netPL = (inv.sales || []).reduce((acc, s) => acc + ((s.sellPrice - inv.buyPrice) * s.unitsSold), 0);

                  return (
                    <tr key={inv._id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="p-3 font-medium text-white">
                        {inv.assetName}
                        <div className="text-xs text-slate-400">{inv.assetType}</div>
                      </td>
                      <td className="p-3 text-right text-slate-300">{inv.quantity}</td>
                      <td className="p-3 text-right text-slate-300">₹{inv.buyPrice?.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-slate-300">₹{invested.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-center text-slate-400">{new Date(inv.date).toLocaleDateString('en-IN')}</td>
                      <td className="p-3 text-right font-semibold text-cyan-400">
                        {/* --- EDIT #2: Change currency symbol from '₹' to '$' --- */}
                        {showLivePrice ? (livePrice ? `$${Number(livePrice).toLocaleString('en-US', { maximumFractionDigits: 2 })}` : 'N/A') : '-'}
                      </td>
                      <td className="p-3 text-center font-bold text-white">{remainingQty}</td>
                      <td className={`p-3 text-right font-bold ${netPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(inv.sales?.length || 0) > 0 ? `₹${netPL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenSellModal(inv)} className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-full transition-colors" title="Sell"><DollarSign size={16} /></button>
                          <button onClick={() => handleOpenEditModal(inv)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors" title="Edit"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(inv)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-full transition-colors" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="9" className="text-center p-8 text-slate-400">No investments found for this category.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modals --- */}
      <Editinvestment isOpen={isEditModalOpen} onClose={handleCloseEditModal} investment={currentInvestment} onRefresh={fetchData} />
      <SellModal isOpen={isSellModalOpen} onClose={handleCloseSellModal} investment={investmentToSell} onSaleSubmit={async (investmentId, saleData) => {
          try {
            await userService.addSale(investmentId, saleData, user.token);
            handleCloseSellModal();
            fetchData();
          } catch (error) {
            console.error('Sale failed:', error);
          }
        }} remainingQty={remainingQtyForModal} />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmDelete} title="Delete Investment" message={`Are you sure you want to permanently delete the investment in ${investmentToDelete?.assetName}? This action cannot be undone.`} />
    </div>
  );
}

/**
 * A reusable confirmation modal component.
 */
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" aria-modal="true">
      <div className="bg-slate-800 w-full max-w-md p-6 rounded-2xl shadow-xl border border-slate-700">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-semibold bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvestmentsPage;