import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SearchProvider } from './context/SearchContext';
import { OrdersProvider } from './context/OrderContext';

// Layout and Pages
import AppLayout from './components/AppLayout';
import MainHome from './components/MainHome';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
// Import all other pages...

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <MainHome /> },
      { path: "/home", element: <Home /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/admin",
        element: <ProtectedRoute adminOnly />,
        children: [
          { path: "edit-home", element: <EditMainHome /> },
          { path: "account", element: <AccountPage /> },
          { path: "add-product", element: <AddProductPage /> },
          { path: "inventory", element: <InventoryPage /> },
          { path: "edit/:id", element: <EditProductPage /> }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/wishlist", element: <Wishlist /> },
          { path: "/cart", element: <Cart /> },
          { path: "/orders", element: <OrdersPage /> }
        ]
      },
      // Other public routes...
    ]
  }
]);

function RootProviders() {
  return (
    <CartProvider>
      <AuthProvider>
        <SearchProvider>
          <ProductProvider>
            <OrdersProvider>
              <WishlistProvider>
                <RouterProvider router={router} />
              </WishlistProvider>
            </OrdersProvider>
          </ProductProvider>
        </SearchProvider>
      </AuthProvider>
    </CartProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootProviders />
  </StrictMode>
);