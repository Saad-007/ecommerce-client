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


  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">#{order.id.slice(-6)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {safeFormat(order.createdAt, "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ${order.total?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.status === "pending" || order.status === "processing" ? (
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleCancel(order)}
                      >
                        Cancel
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;
