import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import { safeFormat } from "../utils/dateUtils";

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { loading, user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/my-orders");
        setOrders(data.orders);
      } catch (err) {
        console.error("Failed to fetch user orders", err);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  const handleCancel = async (order) => {
    const orderId = order.id;
    if (!orderId) {
      alert("Invalid order ID");
      return;
    }

    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      await API.patch(`/orders/${orderId}/cancel`);
      const { data } = await API.get("/orders/my-orders");
      setOrders(data.orders);
    } catch (err) {
      console.error("❌ Failed to cancel order", err.response?.data || err);
      alert("Cancel failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4c4c4c]"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#4c4c4c]">Order History</h2>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-[#4c4c4c]">No orders yet</h3>
          <p className="mt-1 text-gray-500">Your orders will appear here once you make a purchase.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-gray-50 border-b border-gray-200 hidden md:grid">
            <div className="text-sm font-medium text-[#4c4c4c] uppercase tracking-wider">Order ID</div>
            <div className="text-sm font-medium text-[#4c4c4c] uppercase tracking-wider">Date</div>
            <div className="text-sm font-medium text-[#4c4c4c] uppercase tracking-wider">Total</div>
            <div className="text-sm font-medium text-[#4c4c4c] uppercase tracking-wider">Status</div>
            <div className="text-sm font-medium text-[#4c4c4c] uppercase tracking-wider">Actions</div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 hover:bg-gray-50 transition-colors">
                <div>
                  <div className="md:hidden text-xs font-medium text-[#4c4c4c] uppercase tracking-wider">Order ID</div>
                  <div className="text-sm font-medium text-[#4c4c4c]">#{order.id.slice(-6)}</div>
                </div>
                <div>
                  <div className="md:hidden text-xs font-medium text-[#4c4c4c] uppercase tracking-wider">Date</div>
                  <div className="text-sm text-gray-600">
                    {safeFormat(order.createdAt, "MMM d, yyyy")}
                  </div>
                </div>
                <div>
                  <div className="md:hidden text-xs font-medium text-[#4c4c4c] uppercase tracking-wider">Total</div>
                  <div className="text-sm font-medium text-[#4c4c4c]">
                    ${order.total?.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="md:hidden text-xs font-medium text-[#4c4c4c] uppercase tracking-wider">Status</div>
                  <div className="text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="md:hidden text-xs font-medium text-[#4c4c4c] uppercase tracking-wider">Actions</div>
                  <div className="text-sm">
                    {(order.status === "pending" || order.status === "processing") ? (
                      <button
                        onClick={() => handleCancel(order)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;