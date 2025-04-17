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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Appbar />
      
      {/* Main Content */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back{user ? `, ${user.firstname}` : ''}!</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your money with ease</p>
          </div>

          {/* Balance Card - Larger and more prominent */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <Balance value={balance} />
            </div>
          </div>

          {/* Users/Quick Transfer Card - Medium size */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Transfer</h2>
              <Users onSend={handleSendMoney} />
            </div>
          </div>

          {/* Transaction History - Collapsible */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => setShowTransactions(!showTransactions)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h2>
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
              <div className="px-6 pb-6">
                <TransactionHistory />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
                <span className="text-xl font-semibold text-gray-800 dark:text-white">EasyPay</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Making money transfers easy and secure.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Dashboard</Link></li>
                <li><Link to="/profile" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Profile</Link></li>
                <li><Link to="/help" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Help & Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-500 dark:text-gray-400 text-sm">Email: support@easypay.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} EasyPay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
