import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { sendOrderEmail } from "../utils/sendEmail";
import ShippingForm from "./ShippingForm";
import { 
  FiShoppingCart, 
  FiTrash2, 
  FiChevronRight, 
  FiArrowLeft,
  FiCreditCard,
  FiDollarSign
} from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { BsCheckCircle, BsPaypal } from "react-icons/bs";
import { FaGooglePay } from "react-icons/fa";

export default function Cart() {
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    email: user?.email || "",
    street: "",
    city: "",
    zip: ""
  });
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const { total, savings } = cart.reduce(
    (acc, item) => {
      const rawPrice = typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
        : item.price || 0;
      
      const discounted = item.offerPrice && item.offerPrice < rawPrice
        ? item.offerPrice
        : rawPrice;
      
      const itemSavings = rawPrice > discounted ? (rawPrice - discounted) * item.quantity : 0;
      
      return {
        total: acc.total + discounted * item.quantity,
        savings: acc.savings + itemSavings
      };
    },
    { total: 0, savings: 0 }
  );

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      icon: <FiCreditCard className="w-5 h-5" />,
      description: 'Pay with Visa, Mastercard, or other cards'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <BsPaypal className="w-5 h-5 text-blue-500" />,
      description: 'Pay with your PayPal account'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <FaGooglePay className="w-5 h-5 text-teal-500" />,
      description: 'Pay via UPI apps like Google Pay, PhonePe'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <FiDollarSign className="w-5 h-5 text-green-500" />,
      description: 'Pay when you receive your order'
    }
  ];

  const validateAddress = () => {
    if (!address.name || !address.email || !address.street || !address.city || !address.zip) {
      alert("Please fill in all shipping details");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    return true;
  };

const handleCheckout = async () => {
  if (cart.length === 0) return;
  if (!user) {
    navigate('/login');
    return;
  }

  if (!showPaymentMethods) {
    setShowPaymentMethods(true);
    return;
  }

  if (!validateAddress()) return;

  if (!selectedPayment) {
    alert("Please select a payment method");
    return;
  }

  setIsProcessing(true);

  try {
    // 1. Place the order
    placeOrder(cart, selectedPayment);

    // 2. ✅ Send sales data to backend
await fetch(`${API_BASE_URL}/products/sales`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    items: cart.map((item) => ({
      productId: item._id,
      quantity: item.quantity
    }))
  }),
  credentials: "include" // Optional: needed if your backend uses cookies
});

    // 3. Send confirmation email
    await sendOrderEmail(cart, address, total);

    // 4. Clear cart and navigate
    clearCart();
    navigate("/orders", { state: { orderSuccess: true } });

  } catch (error) {
    console.error("Checkout error:", error);
    alert("Failed to complete checkout. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <FiShoppingCart className="mr-3 text-blue-600" />
            Your Shopping Cart
          </h1>
          <p className="mt-2 text-gray-600">
            {cart.length > 0 
              ? "Review your items before checkout"
              : "Your cart is waiting to be filled"}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <HiOutlineShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-2 text-gray-500">
              Looks like you haven't added anything to your cart yet
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const rawPrice = typeof item.price === "string"
                  ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
                  : item.price || 0;
                
                const discounted = item.offerPrice && item.offerPrice < rawPrice
                  ? item.offerPrice
                  : rawPrice;
                
                const itemSavings = rawPrice > discounted ? (rawPrice - discounted) * item.quantity : 0;

                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-32 h-32 object-contain rounded-lg bg-gray-50"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="mt-2">
                            <span className="text-xl font-semibold text-gray-900">
                              ${discounted.toFixed(2)}
                            </span>
                            {rawPrice > discounted && (
                              <>
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  ${rawPrice.toFixed(2)}
                                </span>
                                <span className="ml-2 text-sm font-medium text-green-600">
                                  Save ${(rawPrice - discounted).toFixed(2)} each
                                </span>
                              </>
                            )}
                          </div>

                          <div className="mt-4 flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className={`w-10 h-10 rounded-l-lg border border-gray-300 flex items-center justify-center ${item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                              −
                            </button>
                            <div className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center text-gray-900 font-medium">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-10 h-10 rounded-r-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${(discounted * item.quantity).toFixed(2)}
                          </p>
                          {itemSavings > 0 && (
                            <p className="text-sm text-green-600 mt-1">
                              <BsCheckCircle className="inline mr-1" />
                              Saved ${itemSavings.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Savings</span>
                      <span className="font-medium text-green-600">
                        -${savings.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">FREE</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Total</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {showPaymentMethods && (
                  <>
                    <ShippingForm 
                      address={address} 
                      setAddress={setAddress} 
                    />

                    <div className="mt-6 space-y-4">
                      <h3 className="text-md font-medium text-gray-900">
                        Select Payment Method
                      </h3>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedPayment === method.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="mr-3">{method.icon}</div>
                              <div>
                                <h4 className="font-medium text-gray-900">{method.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {method.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center ${
                    isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : showPaymentMethods ? (
                    <>
                      {selectedPayment ? `Pay with ${paymentMethods.find(m => m.id === selectedPayment)?.name}` : 'Confirm Payment'}
                      <FiChevronRight className="ml-2" />
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <FiChevronRight className="ml-2" />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Free returns within 30 days
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}