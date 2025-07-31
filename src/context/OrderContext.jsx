import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "../api/api";

const OrdersContext = createContext();
export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, isAdmin } = useAuth(); // ✅ use isAdmin directly

  const [adminStats, setAdminStats] = useState(null);

  const fetchAdminStats = async () => {
    try {
      const response = await API.get("/orders/admin/stats");
      setAdminStats(response.data);
      return response.data;
    } catch (err) {
      console.error("❌ Failed to fetch admin stats:", err);
      setError("Failed to load admin stats");
      return null;
    }
  };
  useEffect(() => {
    if (isAdmin) {
      console.log("👮 Admin user, fetching orders and stats...");
      fetchAllOrders();
      fetchAdminStats();

      const interval = setInterval(() => {
        fetchAllOrders();
        fetchAdminStats();
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setOrders([]);
      setAdminStats(null);
    }
  }, [isAdmin, user?.id]);

  const fetchAllOrders = async () => {
    console.log("Starting order fetch...");
    setLoading(true);
    setError(null);

    try {
      const response = await API.get("/orders");
      console.log("Full API response:", response.data);

      const ordersData = response.data?.data || [];
      console.log("Processed orders:", ordersData);
      setOrders(ordersData);

      if (ordersData.length === 0) {
        console.warn("Received empty orders array");
        setError("No orders found - please check backend logs");
      }

      return ordersData;
    } catch (err) {
      console.error("Fetch failed:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.response?.data?.message || "Failed to load orders");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (items, paymentMethod, shippingAddress) => {
  setLoading(true);
  setError(null);

  try {
    // Validate input
    if (!items || items.length === 0) {
      throw new Error('Your cart is empty');
    }

    const orderData = {
      items: items.map(item => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      paymentMethod,
      shippingAddress: {
        ...shippingAddress,
        email: shippingAddress.email || user?.email
      }
    };

    // Clear any previous errors
    setError(null);

    const response = await API.post('/orders', orderData, {
      timeout: 30000 // 30 second timeout
    });

    // Validate response structure
    if (!response.data?.success || !response.data.order) {
      throw new Error('Invalid response from server');
    }

    // Update frontend state
    setOrders(prev => [response.data.order, ...prev]);
    
    // Return the complete order data
    return {
      success: true,
      order: response.data.order
    };

  } catch (err) {
    // Enhanced error handling
    const errorMsg = err.response?.data?.message || 
                    err.message || 
                    'Checkout failed. Please try again.';
    
    setError(errorMsg);
    
    // Return error information
    return {
      success: false,
      message: errorMsg
    };
  } finally {
    setLoading(false);
  }
};

  // In OrderContext.jsx - updateOrderStatus
  // OrderContext.jsx - updateOrderStatus
  // In your OrderContext.jsx
  // Enhanced updateOrderStatus function
  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    setError(null);

    const existingOrder = orders.find(
      (order) => order._id === orderId || order.id === orderId
    );

    if (!existingOrder) {
      const msg = `Order not found in local state (id: ${orderId})`;
      console.warn(msg);
      setError(msg);
      setLoading(false);
      return;
    }

    if (existingOrder.status === newStatus) {
      const msg = `⚠️ Skipping update — order ${orderId} already has status '${newStatus}'`;
      console.warn(msg);
      setError(msg);
      setLoading(false);
      return;
    }

    try {
      console.log("Updating order status:", {
        orderId,
        currentStatus: existingOrder.status,
        newStatus,
        user: user.id,
      });

      const response = await API.patch(`/orders/${orderId}`, {
        status: newStatus,
        changedBy: user.id,
        note: `Status changed to ${newStatus} by ${user.name}`,
      });

      const updatedOrder = response.data?.data || response.data;

      if (!updatedOrder?.id && !updatedOrder?._id) {
        throw new Error("Invalid response format from server");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId || order.id === orderId
            ? {
                ...order,
                status: newStatus,
                statusHistory: [
                  ...(order.statusHistory || []),
                  {
                    status: newStatus,
                    changedAt: new Date().toISOString(),
                    changedBy: user.id,
                    note: `Status changed to ${newStatus}`,
                  },
                ],
              }
            : order
        )
      );

      return updatedOrder;
    } catch (err) {
      console.error("Status update failed:", {
        error: err,
        response: err.response?.data,
        config: err.config,
      });

      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update order status";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      console.log("👮 Admin user, fetching orders...");
      fetchAllOrders();

      const interval = setInterval(() => {
        console.log("🔁 Refreshing orders...");
        fetchAllOrders();
      }, 30000);

      return () => {
        console.log("🧹 Clearing order fetch interval");
        clearInterval(interval);
      };
    } else {
      console.log("🚫 Not admin, clearing orders");
      setOrders([]);
    }
  }, [isAdmin, user?.id]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        placeOrder,
        updateOrderStatus,
        setOrders,
        fetchOrders: fetchAllOrders,
        fetchAdminStats,
        adminStats,
        clearErrors: () => setError(null),
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
