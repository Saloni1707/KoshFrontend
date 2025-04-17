import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const SendMoney = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const userToken = localStorage.getItem("token");

    if (!userToken) {
      logout();
      return;
    }
    
    if (!id || !name) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, id, name, logout]);

  const handleTransfer = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await axios.post(
        import.meta.env.VITE_SERVER_URL + "/api/v1/account/transfer",
        {
          to: id,
          amount: parseFloat(amount),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      
      setSuccess(true);
    } catch (error) {
      console.error("Transfer error:", error);
      if (error.response?.status === 401) {
        await logout();
      } else {
        setError(error.response?.data?.message || "Transfer failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitial = () => {
    if (!name) return 'U';
    const decodedName = decodeURIComponent(name);
    return decodedName.charAt(0).toUpperCase();
  };

  if (success) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Successfully sent ₹{amount} to {decodeURIComponent(name)}
          </p>
          <button
            onClick={() => navigate("/dashboard", { replace: true })}
            className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Send Money</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Transfer money to another user</p>

        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
              {getInitial()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">{decodeURIComponent(name)}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Recipient</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount (in ₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <button
          onClick={handleTransfer}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium mb-3 ${
            loading
              ? "bg-indigo-400 dark:bg-indigo-500/50 cursor-not-allowed"
              : "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600"
          }`}
        >
          {loading ? "Processing..." : "Send Money"}
        </button>

        <button
          onClick={() => navigate("/dashboard", { replace: true })}
          className="w-full py-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};