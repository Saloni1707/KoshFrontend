// src/pages/Signup.jsx
import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { TransactionHistory } from "../components/TransactionHistory";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [bal, setBal] = useState(0);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    //check if the token exists in the local storage
    if (!userToken) {
      navigate("/signin");
    } else {
      //Fetch balance if token exists
      axios
        .get(import.meta.env.VITE_SERVER_URL + "/api/v1/account/balance", {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        })
        .then((response) => {
          setBal(response.data.balance);
        })
        .catch((error) => {
          console.error("Error fetching balance:", error);
          if (error.response && error.response.status === 401) {
            navigate("/signin");
          }
        });
    }
  }, [navigate]);

  const handleSendMoney = (userId) => {
    // Get the user's name from the users list
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Appbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <Balance value={bal} />
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
  
