import React, { createContext, useContext, useState, useEffect } from "react";
import { getDiscountedPrice } from "../utils/Prizeutils";
import { useAuth } from "./AuthContext";
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();
  const [hasMergedCart, setHasMergedCart] = useState(false);


  // Load appropriate cart based on auth state
  const loadCart = async () => {
    const token = localStorage.getItem("token");
    
    if (token && user && user.role !== "admin") {
      // Load user cart from server
      try {
        const res = await fetch("http://localhost:5000/api/cart", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (!res.ok) throw new Error("Failed to load cart");

        const data = await res.json();
        
        if (data.cart) {
          const normalized = data.cart.map(item => ({
            ...item.productId,
            quantity: item.quantity,
            id: item.productId._id
          }));
          setCart(normalized);
        }
      } catch (error) {
        console.error("Cart load error:", error);
      }
    } else {
      // Load guest cart from localStorage
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        setCart(JSON.parse(guestCart));
      }
    }
  };

  // Save cart to appropriate location based on auth state
  useEffect(() => {
    if (cart.length === 0) return;

    const token = localStorage.getItem("token");
    
    if (token && user && user.role !== "admin") {
      // Save to server for logged-in users
      const saveCart = async () => {
        try {
          const formattedCart = cart.map(item => ({
            productId: item._id || item.id,
            quantity: item.quantity
          }));

          const res = await fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ cart: formattedCart }),
          });

          if (!res.ok) throw new Error("Cart save failed");
        } catch (error) {
          console.error("Cart save error:", error);
        }
      };

      const timer = setTimeout(saveCart, 500);
      return () => clearTimeout(timer);
    } else {
      // Save to localStorage for guests
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  }, [cart, user]);
useEffect(() => {
  if (user === null) {
    setCart([]);
    localStorage.removeItem("guestCart");
  }
}, [user]);

  // Handle cart merging when user logs in
  useEffect(() => {
    const handleLoginMerge = async () => {
      const guestCart = localStorage.getItem('guestCart');
      if (user && user.role !== "admin" && guestCart) {
        try {
          const parsedGuestCart = JSON.parse(guestCart);
          
          // Merge guest cart with server cart
          const mergedCart = [...cart, ...parsedGuestCart].reduce((acc, item) => {
            const existing = acc.find(i => i.id === item.id);
            if (existing) {
              existing.quantity += item.quantity;
            } else {
              acc.push({...item});
            }
            return acc;
          }, []);

          // Update local state
          setCart(mergedCart);
          
          // Clear guest cart
          localStorage.removeItem('guestCart');
        } catch (error) {
          console.error("Cart merge error:", error);
        }
      }
    };

    handleLoginMerge();
  }, [user]); // Run when user state changes

useEffect(() => {
  if (user !== undefined) {
    loadCart();
  }
}, [user]);


  // Cart operations (add/remove/update)
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };
const removeFromCart = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (token && user && user.role !== "admin") {
      // Optimistic UI update
      setCart(prev => prev.filter(item => item.id !== id));
      
      // Update backend
      const updatedCart = cart.filter(item => item.id !== id);
      const formattedCart = updatedCart.map(item => ({
        productId: item._id || item.id,
        quantity: item.quantity
      }));

      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart: formattedCart }),
      });

      if (!res.ok) {
        // Revert if failed
        loadCart();
        throw new Error("Failed to update cart on server");
      }
    } else {
      // For non-logged in users
      setCart(prev => prev.filter(item => item.id !== id));
    }
  } catch (error) {
    console.error("Remove from cart error:", error);
    // Optionally show error to user
    loadCart(); // Reset to server state
  }
};

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + amount } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => {
    const discounted = getDiscountedPrice(item.price, item.off);
    return sum + discounted * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
