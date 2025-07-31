import React from "react"; 
import ProductCard from "../components/ProductCard";
import { useSearch } from "../context/SearchContext";
import { useProducts } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, isAdmin } = useAuth();
  const { searchQuery } = useSearch();
  const { products } = useProducts();
  const navigate = useNavigate();
const filteredProducts = products.filter((product) => {
  const query = searchQuery.trim().toLowerCase();
  return (
    product.name?.toLowerCase().includes(query) ||
    product.category?.toLowerCase().includes(query) ||
    product.description?.toLowerCase().includes(query)
  );
});


  const getNewArrivals = () => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  };

const getMostSelling = () => {
  return [...products]
    .filter((p) => typeof p.salesCount === "number" && p.salesCount > 0)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 8);
};





  const newArrivals = getNewArrivals();
  const mostSelling = getMostSelling();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative">
      {searchQuery ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            Search results for "<span className="font-bold">{searchQuery}</span>"
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-lg">
                No products found.
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          {/* 🆕 New Arrivals Section */}
          <section className="mb-12" id="New-Arrival">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">New Arrivals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-3">
              {newArrivals.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </section>

          {/* 🔥 Most Selling Section */}
          <section id="most-selling">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Most Selling</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {mostSelling.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ➕ Admin Add Product Button */}
      {isAdmin && (
        <button
          onClick={() => navigate("/admin/add-product")}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
          title="Add Product"
        >
          <FaPlus />
        </button>
      )}
    </div>
  );
}