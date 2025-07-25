import React, { createContext, useContext, useState, useEffect } from "react";
import { getDiscountedPrice } from "../utils/Prizeutils";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();
  const [hasMergedCart, setHasMergedCart] = useState(false);

 const loadCart = async () => {
  const token = localStorage.getItem("token");

  if (token && user && user.role !== "admin") {
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to load cart");

      const data = await res.json();

      if (data.cart) {
        const normalized = data.cart.map((item) => ({
          ...item.productId,
          quantity: item.quantity,
          id: item.productId._id,
        }));
        setCart(normalized);
      } else {
        setCart([]); // even if empty
      }
    } catch (error) {
      console.error("Cart load error:", error);
    }
  } else {
    // Load guest cart
    const guestCart = localStorage.getItem("guestCart");
    if (guestCart) {
      try {
        setCart(JSON.parse(guestCart));
      } catch {
        setCart([]);
      }
    }
  }
};
const saveCartToBackend = async (newCart = cart) => {
  const token = localStorage.getItem("token");
  if (!token || !user || user.role === "admin") return;

  try {
    const formattedCart = newCart.map((item) => ({
      productId: item._id || item.id,
      quantity: item.quantity,
    }));

    await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart: formattedCart }),
    });
  } catch (err) {
    console.error("Cart save error:", err);
  }
};

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (user && token && user.role !== "admin") {
    const saveCart = async () => {
      try {
        const formattedCart = cart.map((item) => ({
          productId: item._id || item.id,
          quantity: item.quantity,
        }));

        await fetch(`${API_BASE_URL}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart: formattedCart }),
        });
      } catch (err) {
        console.error("Cart save error:", err);
      }
    };

    const timeout = setTimeout(saveCart, 500);
    return () => clearTimeout(timeout);
  } else {
    localStorage.setItem("guestCart", JSON.stringify(cart));
  }
}, [cart, user]);


useEffect(() => {
  if (user === null) {
    setCart([]); // don't remove guestCart; it's for guests
  }
}, [user]);

 useEffect(() => {
  const mergeAndSaveCart = async () => {
    const token = localStorage.getItem("token");
    const guestCartRaw = localStorage.getItem("guestCart");

    if (!user || user.role === "admin" || hasMergedCart) return;

    // 1. Load backend cart
    let backendCart = [];
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        backendCart = (data.cart || []).map((item) => ({
          ...item.productId,
          quantity: item.quantity,
          id: item.productId._id,
        }));
      }
    } catch (err) {
      console.error("Failed to load backend cart:", err);
    }

    // 2. Merge with guest cart
    let guestCart = [];
    try {
      if (guestCartRaw) guestCart = JSON.parse(guestCartRaw);
    } catch {}

    const mergedCart = [...backendCart, ...guestCart].reduce((acc, item) => {
      const existing = acc.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);

    // 3. Save merged cart
    setCart(mergedCart);
    await saveCartToBackend(mergedCart);

    // 4. Cleanup
    localStorage.removeItem("guestCart");
    setHasMergedCart(true);
  };

  mergeAndSaveCart();
}, [user, hasMergedCart]);

const addToCart = (product) => {
  setCart((prev) => {
    const exists = prev.find((item) => item.id === product.id);
    const updatedCart = exists
      ? prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...prev, { ...product, quantity: 1 }];

    // 🔁 Save to backend
    saveCartToBackend(updatedCart);
    return updatedCart;
  });
};

  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (token && user && user.role !== "admin") {
       const updatedCart = cart.filter(item => item.id !== id);
setCart(updatedCart);

        const formattedCart = updatedCart.map(item => ({
          productId: item._id || item.id,
          quantity: item.quantity
        }));

        const res = await fetch(`${API_BASE_URL}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart: formattedCart }),
        });

        if (!res.ok) {
          loadCart();
          throw new Error("Failed to update cart on server");
        }
      } else {
        setCart(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      loadCart();
    }
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + amount } : item
      )
    );
  };

  const clearCart = () => {
  setCart([]);
  saveCartToBackend([]);
};


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
