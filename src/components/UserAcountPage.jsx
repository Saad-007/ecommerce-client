import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";

const UserAccountPage = () => {
  const { user, logout, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6 border">
        <p className="text-lg font-semibold mb-2">Name:</p>
        <p className="mb-4">{user.name}</p>

        <p className="text-lg font-semibold mb-2">Email:</p>
        <p className="mb-4">{user.email}</p>

        <p className="text-lg font-semibold mb-2">Role:</p>
        <p className="mb-4 capitalize">{user.role}</p>

        {/* Add more fields if needed */}
      </div>

      <div className="flex gap-4">
        <Link
          to="/orders"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Orders
        </Link>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserAccountPage;
