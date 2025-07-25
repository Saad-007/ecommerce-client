import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);

  // Load user-specific cart when auth changes
  useEffect(() => {
    const loadCart = async () => {
      if (user && token) {
        try {
          const response = await fetch('/api/cart', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          setCart(data.cart || []);
        } catch (error) {
          console.error("Failed to load cart:", error);
        }
      } else {
        // Load guest cart from localStorage
        const guestCart = localStorage.getItem('guestCart');
        setCart(guestCart ? JSON.parse(guestCart) : []);
      }
    };
    
    loadCart();
  }, [user, token]);

  // Save cart changes
  useEffect(() => {
    const saveCart = async () => {
      if (user && token) {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cart })
          });
        } catch (error) {
          console.error("Failed to save cart:", error);
        }
      } else {
        // Save guest cart to localStorage
        localStorage.setItem('guestCart', JSON.stringify(cart));
      }
    };
    
    saveCart();
  }, [cart, user, token]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity: 1 }];
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