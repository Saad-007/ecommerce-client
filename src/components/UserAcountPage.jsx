import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiShield, FiShoppingBag, FiLogOut } from "react-icons/fi";

const UserAccountPage = () => {
  const { user, logout, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading your account...</div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-3">
          Account <span className="font-medium">Overview</span>
        </h1>
        <div className="w-20 h-0.5 bg-gray-200 mx-auto"></div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 sm:p-8">
          <div className="flex items-start space-x-6">
            <div className="bg-gray-100 p-4 rounded-full">
              <FiUser className="w-6 h-6 text-gray-600" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-medium text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-500 mb-4">{user.email}</p>
              
              <div className="inline-block px-3 py-1 bg-blue-50 rounded-full">
                <span className="text-sm font-medium text-blue-600 capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="border-t border-gray-100 grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FiMail className="w-5 h-5 text-gray-400 mr-3" />
              <h3 className="font-medium text-gray-700">Email Verification</h3>
            </div>
            <p className="text-sm text-gray-500 pl-8">
              {user.emailVerified ? "Verified" : "Not verified"}
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FiShield className="w-5 h-5 text-gray-400 mr-3" />
              <h3 className="font-medium text-gray-700">Account Security</h3>
            </div>
            <p className="text-sm text-gray-500 pl-8">
              Last login: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/User-Order"
          className="flex-1 flex items-center justify-center space-x-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-all hover:shadow-sm"
        >
          <FiShoppingBag className="w-5 h-5" />
          <span>View Order History</span>
        </Link>

        <button
          onClick={logout}
          className="flex-1 flex items-center justify-center space-x-2 bg-white border border-gray-200 hover:border-red-100 text-red-500 px-6 py-3 rounded-lg transition-all hover:shadow-sm"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Additional Sections (expandable) */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Account Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link 
            to="/account/edit" 
            className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <h4 className="font-medium text-gray-800 mb-1">Edit Profile</h4>
            <p className="text-sm text-gray-500">Update your personal information</p>
          </Link>
          <Link 
            to="/account/security" 
            className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <h4 className="font-medium text-gray-800 mb-1">Security</h4>
            <p className="text-sm text-gray-500">Change password and 2FA settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserAccountPage;