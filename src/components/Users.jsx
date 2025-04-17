import { useEffect, useState } from "react";
import { Button } from "./Button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = ({onSend}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userToken = localStorage.getItem("token");
                if (!userToken) {
                    navigate("/signin");
                    return;
                }

                const response = await axios.get(
                    import.meta.env.VITE_SERVER_URL + "/api/v1/user/bulk?filter=" + filter,
                    {
                        headers: {
                            Authorization: "Bearer " + userToken
                        }
                    }
                );
                
                // Check if response.data.user exists (the API returns user, not users)
                if (response.data && response.data.user) {
                    setUsers(response.data.user);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to load users. Please try again later.");
                if (error.response && error.response.status === 401) {
                    navigate("/signin");
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchUsers();
    }, [navigate, filter]);

    if (loading) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Users</h2>
            
            <div className="mb-4">
                <input 
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </div>
            
            {users.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-600 dark:text-gray-400">No users found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {users.map(user => (
                        <div key={user._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                                        {user.firstname[0]?.toUpperCase()}{user.lastname[0]?.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{user.firstname} {user.lastname}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.username}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => onSend(user._id)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                            >
                                Send Money
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

function User({user}){
    const navigate = useNavigate();

    return(
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstname[0].toUpperCase()}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.firstname} {user.lastname}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <Button
                    onClick={(e) => {
                        navigate("/send?id=" + user._id + "&name=" + user.firstname);
                    }}
                    label = {"Send Money"}
                />
            </div>
        </div>
    );
}