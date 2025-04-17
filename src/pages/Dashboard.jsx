import { useEffect, useState, useCallback } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { TransactionHistory } from "../components/TransactionHistory";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

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
    <div className="bg-gray-50 min-h-screen">
      <Appbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <Balance value={balance} />
        </div>
            
        <div className="bg-white rounded-xl shadow-md p-6">
          <Users onSend={handleSendMoney} />
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button 
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
            className="w-full p-4 flex items-center justify-between text-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>Transaction History</span>
            <span 
              className="transform transition-transform duration-200" 
              style={{
                transform: isHistoryVisible ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            >
              ▼
            </span>
          </button>
          
          {isHistoryVisible && (
            <div className="p-4">
              <TransactionHistory />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
