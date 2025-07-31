import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { safeFormat } from "../utils/dateUtils";
import { Link, useNavigate } from "react-router-dom";
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
  FiMenu,
  FiX
} from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Switch } from "@headlessui/react";

Chart.register(...registerables);

const AccountPage = () => {
  const { user, logout } = useAuth();
  const { orders, updateOrderStatus, fetchOrders } = useOrders();
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
  const [updatingOrderIds, setUpdatingOrderIds] = useState(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate store statistics
  useEffect(() => {
    if (orders.length > 0) {
      const nonCancelledOrders = orders.filter(
        (order) => !order.status || !order.status.toLowerCase().includes("cancel")
      );

      const validOrders = nonCancelledOrders;
      const totalRevenue = validOrders.reduce(
        (sum, order) => sum + (Number(order.total) || 0),
        0
      );

      const currentMonth = safeFormat(new Date(), "yyyy-MM");
      const monthlyRevenue = validOrders
        .filter((order) => safeFormat(order.date, "yyyy-MM") === currentMonth)
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

      setStoreStats({
        totalRevenue,
        monthlyRevenue,
        totalOrders: validOrders.length,
        activeCustomers: new Set(validOrders.map((o) => o.customerEmail)).size,
      });
    } else {
      setStoreStats({
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalOrders: 0,
        activeCustomers: 0,
      });
    }
  }, [orders]);

  // Set admin data
  useEffect(() => {
    if (user) {
      setAdminData({
        name: user.name || "Admin",
        email: user.email || "",
        phone: user.phone || "Not provided",
        joinDate: safeFormat(user.createdAt, "MMMM d, yyyy"),
      });
    }
  }, [user]);

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderIds((prev) => new Set(prev).add(orderId));
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } finally {
      setUpdatingOrderIds((prev) => {
        const copy = new Set(prev);
        copy.delete(orderId);
        return copy;
      });
    }
  };

  // Chart data
  const last7Days = [...Array(7)]
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return safeFormat(date, "MMM d");
    })
    .reverse();

  const dailySalesMap = {};
  last7Days.forEach((date) => (dailySalesMap[date] = 0));

  orders.forEach((order) => {
    const formattedDate = safeFormat(order.date, "MMM d");
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
    const status = (order.status || "Completed").toLowerCase();
    switch (status) {
      case "completed":
        statusCounts.Completed++;
        break;
      case "processing":
        statusCounts.Processing++;
        break;
      case "cancelled":
        statusCounts.Cancelled++;
        break;
      default:
        statusCounts.Processing++;
    }
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
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-500"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {activeTab === "dashboard" ? "Dashboard" : "My Account"}
        </h1>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <FiUser className="text-indigo-600" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-md p-4 z-10">
            <div className="flex items-center space-x-2 p-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <FiUser className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium">{adminData.name}</h3>
                <p className="text-xs text-gray-500">Store Admin</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab("account");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
                  activeTab === "account"
                    ? "bg-indigo-50 text-indigo-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <FiSettings />
                <span>My Account</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
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
        )}

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 bg-white shadow-md min-h-screen p-4">
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
        <div className="flex-1 p-4 lg:p-8">
          {activeTab === "dashboard" && (
            <>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 lg:mb-0">
                  Store Dashboard
                </h1>
                <div className="text-sm text-gray-500">
                  Last updated: {safeFormat(new Date(), "MMMM d, yyyy h:mm a")}
                </div>
              </div>

              {/* Stats Cards - Responsive Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xs md:text-sm text-gray-500">
                          {stat.title}
                        </div>
                        <div className="text-lg md:text-xl font-bold mt-1">
                          {stat.value}
                        </div>
                      </div>
                      <div className="text-xl">{stat.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts - Stacked on mobile */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-medium mb-3">Recent Sales (Last 7 Days)</h3>
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
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-medium mb-3">Order Status Distribution</h3>
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

              {/* Recent Orders - Responsive Table */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <h3 className="font-medium mb-2 sm:mb-0">Recent Orders</h3>
                  <Link 
                    to="/orders" 
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View All Orders
                  </Link>
                </div>
                <div className="min-w-full">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Order ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Customer
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => {
                        const orderId = order._id || order.id;
                        return (
                          <tr key={orderId} className="hover:bg-gray-50">
                            <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                              #{orderId?.slice(-6) || "N/A"}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {safeFormat(
                                order.date || order.createdAt,
                                "MMM d, yyyy"
                              )}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {order.customerEmail ||
                                order.user?.email ||
                                "Guest"}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              ${order.total?.toFixed(2) || "0.00"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "account" && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
              {/* Header */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Admin Profile
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Manage your account settings
                    </p>
                  </div>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-3 sm:mt-0 flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                    >
                      <FiEdit className="text-indigo-600" />
                      <span className="text-indigo-600 font-medium">
                        Edit Profile
                      </span>
                    </button>
                  ) : (
                    <div className="mt-3 sm:mt-0 flex space-x-2">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md text-gray-600 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 font-medium flex items-center"
                      >
                        <FiSave className="mr-2" />
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-3">
                        <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md overflow-hidden">
                          <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <FiUser className="w-12 h-12" />
                          </div>
                        </div>
                        {editMode && (
                          <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50">
                            <FiEdit2 className="text-indigo-600 w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">
                        {adminData.name}
                      </h2>
                      <p className="text-indigo-600 font-medium text-sm">
                        Store Administrator
                      </p>
                      <div className="mt-3 w-full">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Profile Completion</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Information Sections */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Personal Information */}
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FiUser className="mr-2 text-indigo-600" />
                        Personal Information
                      </h3>
                      {editMode && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                          Editing
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                          Full Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="name"
                            value={adminData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">
                            {adminData.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                          Email Address
                        </label>
                        {editMode ? (
                          <input
                            type="email"
                            name="email"
                            value={adminData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">
                            {adminData.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                          Phone Number
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            name="phone"
                            value={adminData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
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
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                      <FiKey className="mr-2 text-indigo-600" />
                      Account Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                          Member Since
                        </label>
                        <p className="text-gray-800 font-medium">
                          {adminData.joinDate}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                          Account Type
                        </label>
                        <div className="flex items-center">
                          <p className="text-gray-800 font-medium mr-2">
                            Store Administrator
                          </p>
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                          Last Login
                        </label>
                        <p className="text-gray-800 font-medium">
                          {safeFormat(new Date(), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                      <FiShield className="mr-2 text-indigo-600" />
                      Security
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                            Password
                          </h4>
                          <p className="text-xs text-gray-500">
                            Last changed 3 months ago
                          </p>
                        </div>
                        <button className="px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg shadow-sm text-indigo-600 hover:bg-gray-50">
                          Change
                        </button>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                            2FA
                          </h4>
                          <p className="text-xs text-gray-500">
                            Extra account security
                          </p>
                        </div>
                        <Switch
                          checked={twoFactorEnabled}
                          onChange={setTwoFactorEnabled}
                          className={`${
                            twoFactorEnabled ? "bg-indigo-600" : "bg-gray-200"
                          } relative inline-flex h-5 w-10 items-center rounded-full`}
                        >
                          <span
                            className={`${
                              twoFactorEnabled
                                ? "translate-x-5"
                                : "translate-x-1"
                            } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <button
                          onClick={logout}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm sm:text-base"
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