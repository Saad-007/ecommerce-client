import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // Load cart when authentication state changes
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (user && token) {
          // Load user cart from backend
          const response = await fetch(`${API}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          setCart(data.cart || []);
        } else {
          // Load guest cart from localStorage
          const guestCart = localStorage.getItem('guestCart');
          setCart(guestCart ? JSON.parse(guestCart) : []);
        }
      } catch (error) {
        console.error("Cart load error:", error);
      }
    };
    loadCart();
  }, [user, token]);

  // Persist cart changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        if (user && token) {
          // Save to backend for authenticated users
          await fetch(`${API}/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cart })
          });
        } else {
          // Save to localStorage for guests
          localStorage.setItem('guestCart', JSON.stringify(cart));
        }
      } catch (error) {
        console.error("Cart save error:", error);
      }
    };
    saveCart();
  }, [cart, user, token]);

  // Add to cart with proper ID handling
  const addToCart = (product) => {
    if (!product?.id && !product?._id) {
      console.error("Product missing ID:", product);
      return;
    }

    setCart(prevCart => {
      const productId = product.id || product._id;
      const existingItem = prevCart.find(item => 
        item.id === productId || item._id === productId
      );

      if (existingItem) {
        return prevCart.map(item =>
          (item.id === productId || item._id === productId)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { 
        ...product,
        id: productId, // Normalize to 'id'
        quantity: 1 
      }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart =>
      prevCart.map(item =>
        (item.id === id || item._id === id)
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart =>
      prevCart.filter(item => item.id !== id && item._id !== id)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};