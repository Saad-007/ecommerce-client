import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useSearch } from "../context/SearchContext";
import ProductCard from "../components/ProductCard";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const { products } = useProducts();
  const { setSearchQuery } = useSearch(); // Sync global search state if needed
  const query = useQuery();
  const searchQuery = query.get("q") || "";

  useEffect(() => {
    setSearchQuery(searchQuery); // Optional: sync search input globally
  }, [searchQuery, setSearchQuery]);

const filteredProducts = products.filter((product) => {
  const searchLower = searchQuery.toLowerCase();
  return (
    product.name.toLowerCase().includes(searchLower) ||
    (product.category && product.category.toLowerCase().includes(searchLower)) ||
    (product.description && product.description.toLowerCase().includes(searchLower)) ||
    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
  );
});

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{searchQuery}"
      </h1>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No products found matching "{searchQuery}"
          </div>
          <Link
            to="/shop"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
