// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import { useCart } from "./CartContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await API.get("auth/me", { withCredentials: true });
        setUser(res.data.data.user);
      } catch (err) {
        console.warn(
          "Auth init failed:",
          err.response?.data?.message || err.message
        );
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const register = async (name, email, password, passwordConfirm) => {
    setError(null);
    try {
      const res = await API.post(
        "/auth/register",
        { name, email, password, passwordConfirm },
        { withCredentials: true }
      );

      localStorage.setItem("token", res.data.token);
      setUser(res.data.data.user);
      navigate("/");
      return res.data.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

// Replace the entire login function with:
const login = async (email, password) => {
  setError(null);
  try {
    await API.post("/auth/login", { email, password }, { withCredentials: true });
    
    // Verify auth status
const res = await API.get("/auth/me", { withCredentials: true });
const fetchedUser = res.data?.data?.user;

if (!fetchedUser) {
  throw new Error("Failed to retrieve user info after login.");
}

setUser(fetchedUser);

const redirectPath = fetchedUser.role === "admin"
  ? "/admin/dashboard"
  : location.state?.from?.pathname || "/";


    navigate(redirectPath);
    return data.user;
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
    throw err;
  }
};
// Add this to your AuthContext
const checkAuth = async () => {
  try {
    const { data } = await API.get('/auth/me');
    setUser(data.user);
    return data.user;
  } catch (err) {
    // Clear any invalid auth state
    setUser(null);
    return null;
  }
};

// Call this on app load
useEffect(() => {
  checkAuth();
}, []);



const logout = async () => {
  try {
    const { clearCart } = useCart(); // ✅ move inside function

    await API.get("/auth/logout");
    localStorage.removeItem("token");
    setUser(null);

    clearCart(); // ✅ clear the cart on logout
    localStorage.removeItem("guestCart");

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
