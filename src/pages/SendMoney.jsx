import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export const SendMoney = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem("token");

    // Check if token exists in local storage
    if (!userToken) {
      navigate("/signin"); // Redirect to sign-in page if token doesn't exist
    }
    
    // Check if id and name are provided
    if (!id || !name) {
      navigate("/dashboard"); // Redirect to dashboard if id or name is missing
    }
  }, [navigate, id, name]);

  const handleTransfer = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post(
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
      
      // Navigate to payment status page with success message
      navigate("/paymentstatus?message=" + encodeURIComponent(res.data.message));
    } catch (error) {
      console.error("Transfer error:", error);
      setError(error.response?.data?.message || "Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get the first letter of the first name for the avatar
  const getInitial = () => {
    if (!name) return 'U';
    const decodedName = decodeURIComponent(name);
    return decodedName.charAt(0).toUpperCase();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-2">Send Money</h2>
        <p className="text-gray-600 text-center mb-6">Transfer money to another user</p>

        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-xl font-semibold text-indigo-600">
              {getInitial()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{decodeURIComponent(name)}</h3>
            <p className="text-sm text-gray-500">Recipient</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (in ₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <button
          onClick={handleTransfer}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium mb-3 ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Processing..." : "Send Money"}
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 bg-gray-200 rounded-lg text-gray-800 font-medium hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};