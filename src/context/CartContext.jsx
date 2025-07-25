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

  const addToCart = (product) => {
    const existing = cart.find((item) => item.productId === product.productId);
    let updated;

    if (existing) {
      updated = cart.map((item) =>
        item.productId === product.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updated);
  };

  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) =>
      item.productId === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCart(updated);
  };

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.productId !== id);
    setCart(updated);
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