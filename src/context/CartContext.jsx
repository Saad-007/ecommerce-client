// src/context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);

  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // Load cart from backend on login or local storage on initial load
  useEffect(() => {
    const loadCart = async () => {
      if (user && token) {
        // Load from backend for logged in users
        try {
          const res = await fetch(`${API}/cart`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setCart(data.cart || []);
          }
        } catch (err) {
          console.error("Cart load failed:", err);
        }
      } else {
        // Load from localStorage for guests
        const guestCart = localStorage.getItem("guestCart");
        if (guestCart) {
          setCart(JSON.parse(guestCart));
        }
      }
    };

    loadCart();
  }, [user, token]);

  // Save cart to appropriate location whenever it changes
  useEffect(() => {
    if (user && token) {
      // Sync to backend for logged in users
      const syncCart = async () => {
        try {
          await fetch(`${API}/cart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ cart }),
          });
        } catch (err) {
          console.error("Cart sync failed:", err);
        }
      };
      syncCart();
    } else {
      // Save to localStorage for guests
      localStorage.setItem("guestCart", JSON.stringify(cart));
    }
  }, [cart, user, token]);

  // src/context/CartContext.js
const addToCart = (product) => {
  setCart((prevCart) => {
    // Normalize the product ID (use _id if available, otherwise id)
    const productId = product._id || product.id;
    
    if (!productId) {
      console.error("Product missing ID:", product);
      return prevCart;
    }

    // Check if product already exists in cart
    const existingIndex = prevCart.findIndex(
      (item) => (item._id || item.id) === productId
    );

    if (existingIndex >= 0) {
      // If exists, increment quantity
      const updatedCart = [...prevCart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + 1
      };
      return updatedCart;
    } else {
      // If new, add to cart with quantity 1
      return [...prevCart, { 
        ...product,
        _id: productId, // Ensure consistent ID field
        quantity: 1 
      }];
    }
  });
};

const updateQuantity = (id, delta) => {
  setCart((prevCart) =>
    prevCart.map((item) =>
      (item._id === id || item.id === id)
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    )
  );
};

const removeFromCart = (id) => {
  setCart((prevCart) =>
    prevCart.filter((item) => item._id !== id && item.id !== id)
  );
};
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};