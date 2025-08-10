//  import { useMemo } from 'react';

// // This component receives the raw investment entries and displays high-level summary data.
// function SummaryCard({ investments }) {
//   // useMemo recalculates totals only when the 'investments' array changes.
//   const summaryData = useMemo(() => {
//     // Calculate the total amount initially invested from all 'buy' transactions.
//     // The `|| 0` ensures that if a value is undefined, it's treated as 0, preventing NaN.
//     const totalInvested = investments.reduce(
//       (accumulator, inv) => accumulator + ((inv.quantity || 0) * (inv.buyPrice || 0)),
//       0
//     );

//     // Calculate the total REALIZED profit or loss from completed sales.
//     const totalProfitLoss = investments.reduce((accumulator, inv) => {
//       // Loop through the sales array for each investment
//       const profitFromSales = (inv.sales || []).reduce((saleAcc, sale) => {
//         // Calculate profit for this specific sale
//         const profit = (sale.unitsSold * sale.sellPrice) - (sale.unitsSold * inv.buyPrice);
//         return saleAcc + profit;
//       }, 0);
//       return accumulator + profitFromSales;
//     }, 0);

//     // Count the number of unique investment entries.
//     const totalAssets = investments.length;

//     return { totalInvested, totalProfitLoss, totalAssets };
//   }, [investments]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//       {/* Card for Total Amount Invested */}
//       <div className="bg-gray-800 p-6 rounded-lg text-center">
//         <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Invested</h3>
//         <p className="text-3xl font-bold mt-2 text-white">
//           ₹{summaryData.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//         </p>
//       </div>

//       {/* Card for Total Realized Profit/Loss with conditional coloring */}
//       <div className={`bg-gray-800 p-6 rounded-lg text-center ${summaryData.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//         <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Profit/Loss</h3>
//         <p className="text-3xl font-bold mt-2">
//           ₹{summaryData.totalProfitLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//         </p>
//       </div>

//       {/* Card for Number of Unique Assets */}
//       <div className="bg-gray-800 p-6 rounded-lg text-center">
//         <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Entries</h3>
//         <p className="text-3xl font-bold mt-2 text-white">{summaryData.totalAssets}</p>
//       </div>
//     </div>
//   );
// }
import { useMemo } from 'react';

function SummaryCard({ investments }) {
  const summaryData = useMemo(() => {
    const totalInvested = investments.reduce(
      (acc, inv) => acc + ((inv.quantity || 0) * (inv.buyPrice || 0)),
      0
    );

    const totalProfitLoss = investments.reduce((acc, inv) => {
      const profitFromSales = (inv.sales || []).reduce((saleAcc, sale) => {
        const profit = (sale.unitsSold * sale.sellPrice) - (sale.unitsSold * inv.buyPrice);
        return saleAcc + profit;
      }, 0);
      return acc + profitFromSales;
    }, 0);

    const totalEntries = investments.length;

    return { totalInvested, totalProfitLoss, totalEntries };
  }, [investments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-2 sm:px-0">
      {/* Total Invested Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] text-white">
        <h3 className="text-sm sm:text-base uppercase tracking-widest font-semibold text-indigo-200">
          Total Invested
        </h3>
        <p className="text-3xl font-extrabold mt-3">
          ₹{summaryData.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Total Profit/Loss Card */}
      <div className={`rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] text-white
        ${summaryData.totalProfitLoss >= 0
          ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600'
          : 'bg-gradient-to-br from-red-500 via-rose-500 to-red-600'
        }`}>
        <h3 className="text-sm sm:text-base uppercase tracking-widest font-semibold text-white/80">
          Total Profit/Loss
        </h3>
        <p className="text-3xl font-extrabold mt-3">
          ₹{summaryData.totalProfitLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Total Entries Card */}
      <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] text-white">
        <h3 className="text-sm sm:text-base uppercase tracking-widest font-semibold text-purple-200">
          Total Entries
        </h3>
        <p className="text-3xl font-extrabold mt-3">{summaryData.totalEntries}</p>
      </div>
    </div>
  );
}

export default SummaryCard;
