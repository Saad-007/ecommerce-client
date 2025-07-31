import React from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const { products } = useProducts();

  const filtered = products.filter(
    (product) => product.category?.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 capitalize">
        {categoryName} Products
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.length > 0 ? (
          filtered.map((product, index) => (
            <div key={index} className="w-full">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found in "{categoryName}" category.
          </div>
        )}
      </div>
    </div>
  );
}