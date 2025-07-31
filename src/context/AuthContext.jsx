import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import API from "../api/api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Create axios instance with credentials
  const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true
  });

  // Check auth status on initial load and page refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/auth/isLoggedIn");
        if (data.isLoggedIn) {
          setUser(data.user);
          
          // Fetch cart if needed
          try {
            const cartRes = await API.get("/cart");
            // You'll need to use your cart context here to set the cart
            // setCart(cartRes.data.cart);
          } catch (cartError) {
            console.error("Cart fetch error:", cartError);
          }
        }
      } catch (err) {
        console.warn("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (name, email, password, passwordConfirm) => {
    setError(null);
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
        passwordConfirm
      });

      setUser(data.data.user);
      navigate("/");
      return data.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      await API.post("/auth/login", { email, password });
      
      // Verify auth status
      const { data } = await API.get("/auth/isLoggedIn");
      if (!data.isLoggedIn) {
        throw new Error("Failed to verify login status");
      }

      setUser(data.user);

      // Fetch user's cart
      try {
        const cartRes = await API.get("/cart");
        // setCart(cartRes.data.cart);
      } catch (cartError) {
        console.error("Cart fetch error:", cartError);
      }

      const redirectPath = data.user.role === "admin"
        ? "/admin/dashboard"
        : location.state?.from?.pathname || "/";

      navigate(redirectPath);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await API.get("/auth/logout");
      setUser(null);
      // Clear cart if needed
      // clearCart();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
        error,
        login,
        register,
        logout,
        setError,
        API // Provide the axios instance
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};