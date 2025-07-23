// context/OrdersContext.js
import React, { createContext, useContext, useState,useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

const placeOrder = (cartItems, paymentMethod, shippingAddress) => {
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const newOrder = {
    id: uuidv4(),
    date: new Date().toISOString(),
    paymentMethod,
    items: cartItems,
    shippingAddress,
    status: "Completed",
    total, // Now total is defined above
  };

  const updatedOrders = [newOrder, ...orders];
  setOrders(updatedOrders);
  localStorage.setItem("orders", JSON.stringify(updatedOrders));
};


 const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);
  return (
    <OrdersContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
};
