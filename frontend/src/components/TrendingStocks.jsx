import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import userService from '../services/UserService.js';

function TrendingStocks() {
  const [stocks, setStocks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        if (user && user.token) {
          const data = await userService.getTrendingStocks(user.token);
          setStocks(data);
        }
      } catch (error) {
        console.error('Failed to fetch trending stocks', error);
      }
    };

    fetchTrending();
  }, [user]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Top NASDAQ Stocks</h2>
      {stocks.length > 0 ? (
        <ul>
          {stocks.map((stock) => (
            <li
              key={stock.symbol}
              className="flex justify-between items-center border-b border-gray-700 py-2"
            >
              <span className="font-bold">{stock.symbol}</span>
              <span className="text-gray-400">{stock.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading trending stocks...</p>
      )}
    </div>
  );
}

export default TrendingStocks;