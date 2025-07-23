import React from "react";
import { useOrders } from "../context/OrderContext";

export default function OrdersPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">📦 Your Orders</h2>
        <p className="text-gray-500">No orders placed yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">📦 Order History</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-100"
          >
            <div className="text-sm text-gray-500 mb-2">Order Date: {order.date}</div>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Shipped To:</strong> {order.shippingAddress?.name} ({order.shippingAddress?.email})
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border p-3 rounded-md"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Price: ${item.offerPrice || item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
