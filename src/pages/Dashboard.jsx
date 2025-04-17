// src/pages/Signup.jsx
import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { TransactionHistory } from "../components/TransactionHistory";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard mounting, token in localStorage:", localStorage.getItem("token"));
    
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");
      console.log("Dashboard mounting - token:", token);

      if (!token) {
        console.log("No token found, redirecting to signin");
        navigate("/signin");
        return;
      }
      
      console.log("About to make API call with token:", token.substring(0, 20) + "...");
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/account/balance`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log("Balance API response:", response.data);
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Balance fetch error:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchBalance();
  }, []);

  const handleSendMoney = (userId) => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/api/v1/user/bulk", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        const users = response.data.user || [];
        const user = users.find(u => u._id === userId);
        if (user) {
          const fullName = `${user.firstname} ${user.lastname}`;
          navigate(`/send?id=${userId}&name=${encodeURIComponent(fullName)}`);
        } else {
          navigate(`/send?id=${userId}&name=User`);
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        navigate(`/send?id=${userId}&name=User`);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
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
            <span className="transform transition-transform duration-200" style={{
              transform: isHistoryVisible ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              ▼
            </span>
          </button>
          
          <div 
            className="transition-all duration-300 ease-in-out"
            style={{
              maxHeight: isHistoryVisible ? '600px' : '0',
              opacity: isHistoryVisible ? '1' : '0',
              overflow: 'hidden'
            }}
          >
            <div className="p-6 border-t border-gray-100">
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
