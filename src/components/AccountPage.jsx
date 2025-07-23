import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";


import {
  FiEdit,
  FiLogOut,
  FiTrendingUp,
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiUser,
  FiEdit2,
  FiSave,
  FiKey,
  FiShield,
  FiLock,
  FiMail,
} from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format } from "date-fns";
import { Switch } from "@headlessui/react";

Chart.register(...registerables);

const AccountPage = () => {
  const { user, logout } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [storeStats, setStoreStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    activeCustomers: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Initialize admin data from user context
  useEffect(() => {
    if (user) {
      setAdminData({
        name: user.name || "Admin",
        email: user.email || "",
        phone: user.phone || "Not provided",
        joinDate: user.createdAt
          ? format(new Date(user.createdAt), "MMMM d, yyyy")
          : "Unknown",
      });
    }
  }, [user]);

  // Calculate store statistics
  useEffect(() => {
    if (orders.length > 0) {
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );
      const currentMonth = format(new Date(), "yyyy-MM");
      const monthlyRevenue = orders
        .filter(
          (order) => format(new Date(order.date), "yyyy-MM") === currentMonth
        )
        .reduce((sum, order) => sum + (order.total || 0), 0);

      setStoreStats({
        totalRevenue,
        monthlyRevenue,
        totalOrders: orders.length,
        activeCustomers: new Set(orders.map((order) => order.customerEmail))
          .size,
      });
    }
  }, [orders]);

  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return format(date, "MMM d");
  }).reverse();

  const dailySalesMap = {};
  last7Days.forEach((date) => (dailySalesMap[date] = 0));

  orders.forEach((order) => {
    const formattedDate = format(new Date(order.date), "MMM d");
    if (formattedDate in dailySalesMap) {
      dailySalesMap[formattedDate] += order.total || 0;
    }
  });

  const salesData = {
    labels: last7Days,
    datasets: [
      {
        label: "Daily Sales ($)",
        data: last7Days.map((date) => dailySalesMap[date]),
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
      },
    ],
  };

  const statusCounts = {
    Completed: 0,
    Processing: 0,
    Cancelled: 0,
  };

  orders.forEach((order) => {
    const status = order.status || "Completed";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const orderStatusData = {
    labels: ["Completed", "Processing", "Cancelled"],
    datasets: [
      {
        data: [
          statusCounts["Completed"],
          statusCounts["Processing"],
          statusCounts["Cancelled"],
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(239, 68, 68, 0.6)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    console.log("Updated admin data:", adminData);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen p-4">
          <div className="flex items-center space-x-2 p-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <FiUser className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium">{adminData.name}</h3>
              <p className="text-xs text-gray-500">Store Admin</p>
            </div>
          </div>

          <nav>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center space-x-2 w-full p-3 rounded-lg mb-2 ${
                activeTab === "account"
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <FiSettings />
              <span>My Account</span>
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center space-x-2 w-full p-3 rounded-lg mb-2 ${
                activeTab === "dashboard"
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <FiTrendingUp />
              <span>Dashboard</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "dashboard" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Store Dashboard
                </h1>
                <div className="text-sm text-gray-500">
                  Last updated: {format(new Date(), "MMMM d, yyyy h:mm a")}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    title: "Total Revenue",
                    value: `$${storeStats.totalRevenue.toFixed(2)}`,
                    icon: <FiDollarSign className="text-indigo-500" />,
                  },
                  {
                    title: "Monthly Revenue",
                    value: `$${storeStats.monthlyRevenue.toFixed(2)}`,
                    icon: <FiTrendingUp className="text-green-500" />,
                  },
                  {
                    title: "Total Orders",
                    value: storeStats.totalOrders,
                    icon: <FiPackage className="text-blue-500" />,
                  },
                  {
                    title: "Active Customers",
                    value: storeStats.activeCustomers,
                    icon: <FiUsers className="text-purple-500" />,
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="text-gray-500 text-sm">
                          {stat.title}
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {stat.value}
                        </div>
                      </div>
                      <div className="text-2xl">{stat.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-4">
                    Recent Sales (Last 7 Days)
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={salesData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-4">
                    Order Status Distribution
                  </h3>
                  <div className="h-64">
                    <Pie
                      data={orderStatusData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Recent Orders</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    View All Orders
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(order.date), "MMM d, yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customerEmail || "Guest"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${order.total?.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status || "Processing"}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value)
                              }
                              className="text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "account" && (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
              {/* Header with animated gradient border */}
              <div className="relative mb-8 pb-6 border-b border-gray-200">
                <div className="absolute bottom-0 left-0 h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      Admin Profile
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Manage your account settings
                    </p>
                  </div>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-300"
                    >
                      <FiEdit className="text-indigo-600" />
                      <span className="text-indigo-600 font-medium">
                        Edit Profile
                      </span>
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 text-gray-600 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 font-medium flex items-center"
                      >
                        <FiSave className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden">
                          <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <FiUser className="w-16 h-16" />
                          </div>
                        </div>
                        {editMode && (
                          <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
                            <FiEdit2 className="text-indigo-600 w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {adminData.name}
                      </h2>
                      <p className="text-indigo-600 font-medium">
                        Store Administrator
                      </p>
                      <div className="mt-4 w-full">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>Profile Completion</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Information Sections */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Information */}
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FiUser className="mr-2 text-indigo-600" />
                        Personal Information
                      </h3>
                      {editMode && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                          Editing
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Full Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="name"
                            value={adminData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">
                            {adminData.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Email Address
                        </label>
                        {editMode ? (
                          <input
                            type="email"
                            name="email"
                            value={adminData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">
                            {adminData.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Phone Number
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            name="phone"
                            value={adminData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">
                            {adminData.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                      <FiKey className="mr-2 text-indigo-600" />
                      Account Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Member Since
                        </label>
                        <p className="text-gray-800 font-medium">
                          {adminData.joinDate}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Account Type
                        </label>
                        <div className="flex items-center">
                          <p className="text-gray-800 font-medium mr-2">
                            Store Administrator
                          </p>
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Last Login
                        </label>
                        <p className="text-gray-800 font-medium">
                          {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                      <FiShield className="mr-2 text-indigo-600" />
                      Security
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Password
                          </h4>
                          <p className="text-sm text-gray-500">
                            Last changed 3 months ago
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-indigo-600 hover:bg-gray-50 transition-colors">
                          Change Password
                        </button>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-gray-500">
                            Add extra security to your account
                          </p>
                        </div>
                        <Switch
                          checked={twoFactorEnabled}
                          onChange={setTwoFactorEnabled}
                          className={`${
                            twoFactorEnabled ? "bg-indigo-600" : "bg-gray-200"
                          } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span
                            className={`${
                              twoFactorEnabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={logout}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FiLogOut />
                          <span>Sign out from all devices</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;