import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const Appbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");

    if (!userToken) {
      navigate("/signin");
    } else {
      axios
        .get(import.meta.env.VITE_SERVER_URL + "/api/v1/user/getUser", {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        })
        .then((response) => {
          setUser(response.data);
        });
    }
  }, [navigate]);

  const signOutHandler = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50 shadow-md h-16 flex items-center px-6 md:px-10">
      {/* Branding */}
      <Link to={"/dashboard"} className="flex items-center space-x-3">
        <div className="text-xl font-bold text-gray-800">KoshPay</div>
      </Link>

      {/* User Info and Actions */}
      <div className="flex-1 flex items-center justify-end space-x-6">
        {/* User Info */}
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-lg font-medium text-gray-800">{user?.firstname}</span>
          <span className="text-sm font-light text-gray-500">{user?.email}</span>
        </div>

        {/* User Avatar */}
        <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center shadow">
          <span className="text-lg font-semibold text-gray-700">
            {user?.firstname?.[0]?.toUpperCase()}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={signOutHandler}
          className="text-gray-700 hover:text-blue-600 px-4 py-2 font-medium rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
