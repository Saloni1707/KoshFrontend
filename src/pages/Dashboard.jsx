import { useEffect, useState, useCallback } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { TransactionHistory } from "../components/TransactionHistory";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const fetchBalance = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      await logout();
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/account/balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Balance fetch error:", error);
      if (error.response?.status === 401) {
        await logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    let mounted = true;
    
    const initializeDashboard = async () => {
      try {
        await fetchBalance();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      mounted = false;
    };
  }, [fetchBalance]);

  const handleSendMoney = useCallback(async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      await logout();
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/bulk`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const users = response.data.user || [];
      const user = users.find(u => u._id === userId);
      const fullName = user ? `${user.firstname} ${user.lastname}` : 'User';
      navigate(`/send?id=${userId}&name=${encodeURIComponent(fullName)}`, { replace: false });
    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.response?.status === 401) {
        await logout();
      } else {
        navigate(`/send?id=${userId}&name=User`, { replace: false });
      }
    }
  }, [navigate, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Appbar />
      
      {/* Main Content */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back{user ? `, ${user.firstname}` : ''}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage your money with ease
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Link
              to="/send"
              className="flex items-center justify-center p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm sm:text-base font-medium transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Money
            </Link>
            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm sm:text-base font-medium transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              History
            </button>
          </div>

          {/* Balance Card */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
              <Balance value={balance} />
            </div>
          </div>

          {/* Users/Quick Transfer Card */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Transfer
              </h2>
              <Users onSend={handleSendMoney} />
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <button 
              onClick={() => setShowTransactions(!showTransactions)}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Transaction History
              </h2>
              <svg 
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${showTransactions ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showTransactions && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <TransactionHistory />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
