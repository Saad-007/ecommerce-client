import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Pages & Components
import Home from "./components/Home";
import ProductDetail from "./components/ProductDetail";
import Navbar from "./components/Navbar";
import Wishlist from "./components/Wishlist";
import Cart from "./components/Cart";
import AdminPage from "./components/Adminpage";
import AddProductPage from "./components/AddProductPage";
import CategoryPage from "./components/CategoryPage";
import InventoryPage from "./components/InventoryPage";
import EditProductPage from "./components/EditProductPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AccountPage from "./components/AccountPage";
import OrdersPage from "./components/OrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import SearchResults from "./components/SearchResults";
import MainHome from "./components/MainHome";
import EditMainHome from "./pages/EditMainHome";
import UserAccountPage from "./components/UserAcountPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AboutUs from "./components/Aboutus";
import UserOrderHistory from "./components/UserOrderHistory";
// Static Pages
import { ContactUs, FAQ, Shipping } from "./components/Statepages";

// Context Providers
import { SearchProvider } from "./context/SearchContext";
import { ProductProvider } from "./context/ProductContext";
import { OrdersProvider } from "./context/OrderContext";

// Loader
import Loader from "./components/Loader";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for critical resources
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <CartProvider>
      {" "}
      {/* ✅ Wrap the entire app with CartProvider */}
      <AuthProvider>
        <SearchProvider>
          <ProductProvider>
            <OrdersProvider>
              <Navbar />
              <main className="min-h-[calc(100vh-160px)]">
                <Routes>
                  <Route path="/" element={<MainHome />} />
                  <Route path="/admin/edit-home" element={<EditMainHome />} />
                  <Route path="/Aboutus" element={<AboutUs />} />
                  <Route path="/Home" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/category/:categoryName"
                    element={<CategoryPage />}
                  />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/account" element={<UserAccountPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                  />
                  <Route path="User-Order" element={<UserOrderHistory />}/>
                  {/* Static Info Pages */}
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/faqs" element={<FAQ />} />
                  <Route path="/shipping" element={<Shipping />} />

                  {/* Protected user routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    {/* <Route path="/account" element={<AccountPage />} /> */}
                    <Route path="/orders" element={<OrdersPage />} />
                  </Route>

                  {/* Admin-only routes */}
                  <Route element={<ProtectedRoute adminOnly />}>
                    <Route path="/admin/account" element={<AccountPage />} />
                    <Route
                      path="/admin/add-product"
                      element={<AddProductPage />}
                    />
                    <Route
                      path="/admin/inventory"
                      element={<InventoryPage />}
                    />
                    <Route
                      path="/admin/edit/:id"
                      element={<EditProductPage />}
                    />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </OrdersProvider>
          </ProductProvider>
        </SearchProvider>
      </AuthProvider>
    </CartProvider>
  );
}
