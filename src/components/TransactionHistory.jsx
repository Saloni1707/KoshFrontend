import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const fetchTransactions = async () => {
            try {
                const userToken = localStorage.getItem("token");
                if (!userToken) {
                    if (isMounted) {
                        navigate("/signin");
                    }
                    return;
                }
    
                // Add this line to see the exact URL being requested
                console.log("Requesting URL:", `${import.meta.env.VITE_SERVER_URL}/api/v1/account/transactions?page=${page}&limit=5`);
    
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/v1/account/transactions?page=${page}&limit=5`,
                    {
                        headers: {
                            Authorization: "Bearer " + userToken
                        }
                    }
                );
    
                // Rest of your code...
            } catch (error) {
                console.error("Error fetching transactions:", error);
                
                // Add this for more detailed error information
                console.error("Error details:", {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                
                if (isMounted) {
                    // Rest of your error handling...
                }
            } finally {
                // Rest of your code...
            }
        };
    
        fetchTransactions();
    
        return () => {
            isMounted = false;
        };
    }, [navigate, page]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTransactionDetails = (transaction) => {
        const userId = localStorage.getItem("userId");
        const isSender = transaction.fromUser._id === userId;
        
        return {
            type: isSender ? "Sent" : "Received",
            amount: transaction.amount,
            otherParty: isSender ? transaction.toUser : transaction.fromUser,
            className: isSender ? "text-red-600" : "text-green-600"
        };
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
                <div className="h-16 bg-gray-200 rounded-lg"></div>
                <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    if (isNewUser) {
        return (
            <div className="text-center py-8">
                <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Welcome to KoshPay!</h3>
                <p className="text-gray-500">Make your first transaction to start building your history.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Transaction History</h3>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-4">
                {transactions.map((transaction) => {
                    const details = getTransactionDetails(transaction);
                    
                    return (
                        <div key={transaction._id} 
                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    details.type === "Sent" ? "bg-red-100" : "bg-green-100"
                                }`}>
                                    <span className={`text-lg ${
                                        details.type === "Sent" ? "text-red-600" : "text-green-600"
                                    }`}>
                                        {details.type === "Sent" ? "↑" : "↓"}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {details.type === "Sent" ? "To: " : "From: "}
                                        {details.otherParty.firstname} {details.otherParty.lastname}
                                    </p>
                                    <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                                </div>
                            </div>
                            <div className={`font-semibold ${details.className}`}>
                                {details.type === "Sent" ? "-" : "+"}₹{details.amount}
                            </div>
                        </div>
                    );
                })}
            </div>

            {pagination && pagination.pages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                        Page {page} of {pagination.pages}
                    </span>
                    <button
                        onClick={() => setPage(prev => Math.min(prev + 1, pagination.pages))}
                        disabled={page === pagination.pages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}; 
