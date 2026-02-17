import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

// Helper function to estimate storage size
const getSizeInBytes = (obj) => {
  return new Blob([JSON.stringify(obj)]).size;
};

// Cache configuration
const CACHE_CONFIG = {
  MAX_SIZE: 4 * 1024 * 1024, // 4MB (leaving room for other data)
  CACHE_KEY: "cachedProducts",
  CACHE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
};

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

const normalizeProduct = (product) => ({
  ...product,
  // ⚡ FIX: Map _id to id manually since .lean() skips the schema transform
  id: product._id || product.id, 
  _id: product._id || product.id,
  image: product.image || "/placeholder-image.png", // Fallback if image is null
  featured: Boolean(product.featured),
  price: Number(product.price) || 0,
});

  const storeProductsInCache = (products) => {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: products,
      };

      const cacheSize = getSizeInBytes(cacheData);

      if (cacheSize > CACHE_CONFIG.MAX_SIZE) {
        console.warn("Products data too large for cache. Only storing essential fields.");

        const minimalProducts = products.map((p) => ({
          _id: p._id,
          name: p.name,
          price: p.price,
          offerPrice: p.offerPrice,
          image: p.image,
          featured: p.featured,
        }));

        const minimalCache = {
          timestamp: Date.now(),
          data: minimalProducts,
        };

        if (getSizeInBytes(minimalCache) <= CACHE_CONFIG.MAX_SIZE) {
          localStorage.setItem(CACHE_CONFIG.CACHE_KEY, JSON.stringify(minimalCache));
        } else {
          console.warn("Even minimal product data exceeds cache limit. Not caching.");
          localStorage.removeItem(CACHE_CONFIG.CACHE_KEY);
        }
      } else {
        localStorage.setItem(CACHE_CONFIG.CACHE_KEY, JSON.stringify(cacheData));
      }
    } catch (error) {
      console.error("Failed to store products in cache:", error);
    }
  };

  const getProductsFromCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_CONFIG.CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached);

      if (Date.now() - parsed.timestamp > CACHE_CONFIG.CACHE_EXPIRY) {
        localStorage.removeItem(CACHE_CONFIG.CACHE_KEY);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error("Failed to read products from cache:", error);
      return null;
    }
  };

  const fetchProducts = async () => {
  try {
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/products`, {
      credentials: "include",
    });

    // If server returns 500, this catch block will trigger
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    
    // Ensure we handle both {products: []} and direct array formats
    const productList = data.products || (Array.isArray(data) ? data : []);
    const normalized = productList.map(normalizeProduct);

    setProducts(normalized);
    setFeaturedProducts(normalized.filter((p) => p.featured === true));
    storeProductsInCache(normalized);

  } catch (error) {
    console.error("Error fetching products:", error);
    
    // ⚡ Recovery: If server fails, try to load from cache again
    const cached = getProductsFromCache();
    if (cached) {
      const normalized = cached.map(normalizeProduct);
      setProducts(normalized);
      setFeaturedProducts(normalized.filter((p) => p.featured === true));
    }
  } finally {
    setLoading(false);
  }
};

  const addProduct = async (product) => {
    try {
      if (typeof product.sold !== "number") product.sold = 0;
      if (typeof product.salesCount !== "number") product.salesCount = product.sold;

      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to add product");
      const data = await res.json();

      setProducts((prev) => [...prev, data.product]);
      if (data.product.featured) {
        setFeaturedProducts((prev) => [...prev, data.product]);
      }
      return data.product;
    } catch (error) {
      console.error("Add product error:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => String(p._id) !== String(productId)));
      setFeaturedProducts((prev) => prev.filter((p) => String(p._id) !== String(productId)));
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${updatedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update product");
      const data = await res.json();

      setProducts((prev) =>
        prev.map((p) => (String(p._id) === String(updatedProduct._id) ? data.product : p))
      );

      if (data.product.featured) {
        setFeaturedProducts((prev) => {
          const exists = prev.some((p) => String(p._id) === String(data.product._id));
          return exists
            ? prev.map((p) => (String(p._id) === String(data.product._id) ? data.product : p))
            : [...prev, data.product];
        });
      } else {
        setFeaturedProducts((prev) =>
          prev.filter((p) => String(p._id) !== String(data.product._id))
        );
      }

      return data.product;
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  };

  const toggleFeatured = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}/featured`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();

      setProducts((prev) =>
        prev.map((p) => (String(p._id) === String(productId) ? data.product : p))
      );

      if (data.product.featured) {
        setFeaturedProducts((prev) => [...prev, data.product]);
      } else {
        setFeaturedProducts((prev) =>
          prev.filter((p) => String(p._id) !== String(productId))
        );
      }

      return data.product;
    } catch (error) {
      console.error("Error toggling featured status:", error);
      throw error;
    }
  };

  // Initialize with cached data while fetching fresh data
  useEffect(() => {
    const cached = getProductsFromCache();
    if (cached) {
      setProducts(cached);
      setFeaturedProducts(cached.filter((p) => p.featured === true));
    }
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProducts,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        toggleFeatured,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
