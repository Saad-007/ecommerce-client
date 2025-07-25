// context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);

  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // ✅ Load cart from backend on login
  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !token) return;

      try {
        const res = await fetch(`${API}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setCart(data.cart || []);
        } else {
          console.error("Cart load failed:", data.message);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };

    fetchCart();
  }, [user, token]);

  // ✅ Sync local cart changes to backend
  const syncCart = async (updatedCart) => {
    setCart(updatedCart);
    if (user && token) {
      try {
        await fetch(`${API}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart: updatedCart }),
        });
      } catch (err) {
        console.error("Sync cart error:", err);
      }
    }
  };

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

    syncCart(updated);
  };

  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) =>
      item.productId === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    syncCart(updated);
  };

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.productId !== id);
    syncCart(updated);
  };

  const clearCart = () => {
    syncCart([]);
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
