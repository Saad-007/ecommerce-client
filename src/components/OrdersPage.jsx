import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { Navigate } from "react-router-dom";
import {
  FiPackage,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiSearch,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiEye,
} from "react-icons/fi";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800", // add delivered

  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const validTransitions = {
  pending: ["processing", "shipped", "cancelled", "completed"],
  processing: ["shipped", "delivered", "cancelled"],
  shipped: ["delivered", "completed"],
  delivered: ["completed"],
  completed: [],
  cancelled: [],
};

const getNextStatuses = (currentStatus) =>
  validTransitions[currentStatus] || [];

const OrderPage = () => {
  const { isAdmin } = useAuth();
  const { orders, loading, error, updateOrderStatus, refreshOrders } =
    useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (order.user?.name || "").toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower) ||
        order.total.toString().includes(searchTerm)
      );
    });
  }, [orders, searchTerm]);
  const handleStatusUpdate = async (orderId, newStatus) => {
    const order = orders.find((o) => o._id === orderId || o.id === orderId);

    if (!order) {
      console.error("Order not found in local state:", orderId);
      return;
    }

    if (order.status === newStatus) {
      console.warn(`⛔ Skipping status update: already '${newStatus}'`);
      return;
    }

    try {
      await updateOrderStatus(orderId, newStatus);
      console.log(`✅ Updated order ${orderId} to ${newStatus}`);
    } catch (error) {
      console.error("❌ Failed to update status:", error);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  if (!isAdmin) return <Navigate to="/" />;
  console.log("Orders data:", {
    orders,
    loading,
    error,
    filteredOrders,
    isAdmin,
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
        <button
          onClick={refreshOrders}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <FiRefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && !orders.length ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No matching orders found"
                      : "No orders available"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => {
                  const id = order._id || order.id || `temp-${idx}`;

                  console.log("✅ Rendering order row for ID:", order.id);
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50">
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900"
                          key={id}
                        >
                          #{order.id?.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiUser className="mr-2 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.user?.name || "Guest"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.user?.email || ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <FiCalendar className="mr-2 inline text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <FiDollarSign className="mr-2 inline text-gray-400" />
                          {order.total?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                statusColors[order.status]
                              }`}
                            >
                              {order.status}
                            </span>

                            <select
                              value=""
                              onChange={(e) => {
                                const selected = e.target.value;
                                if (selected && selected !== order.status) {
                                  handleStatusUpdate(
                                    order.id || order._id,
                                    selected
                                  );
                                }
                              }}
                              className="border rounded px-2 py-1 text-sm"
                              disabled={
                                updatingId === order.id ||
                                updatingId === order._id
                              }
                            >
                              <option value="" disabled>
                                Change status...
                              </option>
                              {getNextStatuses(order.status?.toLowerCase()).map(
                                (status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            <FiEye className="inline mr-1" />
                            {expandedOrderId === order.id ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>
                      {expandedOrderId === order.id && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Shipping Information
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {order.shippingAddress ||
                                    "No address provided"}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Payment Method
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {order.paymentMethod || "Not specified"}
                                </p>
                              </div>
                              <div className="md:col-span-2">
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Order Items
                                </h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Product
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Price
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Quantity
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Total
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {order.items.map((item, index) => (
                                        <tr key={index}>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {item.product?.name ||
                                              "Unknown Product"}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            ${item.price?.toFixed(2)}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {item.quantity}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            $
                                            {(
                                              item.price * item.quantity
                                            ).toFixed(2)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
