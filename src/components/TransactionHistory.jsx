import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all"); // all, sent, received
  const { logout } = useAuth();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    let isMounted = true;
    
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          await logout();
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/account/transactions?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          let filteredTransactions = response.data.transactions || [];
          
          // Apply filter
          if (filter === "sent") {
            filteredTransactions = filteredTransactions.filter(t => t.fromUser._id === userId);
          } else if (filter === "received") {
            filteredTransactions = filteredTransactions.filter(t => t.toUser._id === userId);
          }
          
          setTransactions(filteredTransactions);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        if (error.response?.status === 401) {
          await logout();
        }
        setLoading(false);
      }
    };

    fetchTransactions();
    return () => {
      isMounted = false;
    };
  }, [page, logout, filter, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Dropdown */}
      <div className="mb-4 flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent text-sm"
        >
          <option value="all">All Transactions</option>
          <option value="sent">Money Sent</option>
          <option value="received">Money Received</option>
        </select>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isSender = transaction.fromUser._id === userId;
          const otherUser = isSender ? transaction.toUser : transaction.fromUser;
          const amount = isSender ? -transaction.amount : transaction.amount;

          return (
            <div key={transaction._id} 
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center space-x-4">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  isSender ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'
                }`}>
                  <span className={`text-lg ${
                    isSender ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {isSender ? '↑' : '↓'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {isSender ? 'To' : 'From'}: {otherUser.firstname} {otherUser.lastname}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      transaction.status === 'success' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : transaction.status === 'failed'
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                amount < 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {amount < 0 ? '-' : '+'}₹{Math.abs(amount)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 text-sm rounded-lg ${
            page === 1
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800'
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 text-sm bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};
