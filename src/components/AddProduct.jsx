import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const initialProduct = {
  name: "",
  category: "",
  price: "",
  offerPrice: "",
  description: "",
  quantity: 0,
  status: true,
  image: "",         // Main image
  images: [],        // Additional images
  variants: [],
};

export default function AddProduct() {
  const [product, setProduct] = useState(initialProduct);
  const [newVariant, setNewVariant] = useState({ color: "", size: "", stock: 0, price: 0, sku: "" });
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddVariant = () => {
    if (!newVariant.color || !newVariant.size) return;
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
    setNewVariant({ color: "", size: "", stock: 0, price: 0, sku: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/products", {
        ...product,
        createdAt: new Date().toISOString(),
      });
      toast.success("Product added!");
      navigate("/admin/inventory");
    } catch (err) {
      console.error("Create error:", err);
      toast.error("Failed to add product.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Offer Price"
            value={product.offerPrice}
            onChange={(e) => setProduct({ ...product, offerPrice: e.target.value })}
            className="p-2 border rounded"
          />
        </div>

        {/* Main Image */}
        <label className="block">Main Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {product.image && <img src={product.image} alt="preview" className="w-24 h-24 mt-2" />}

        {/* Multiple Images */}
        <label className="block">Gallery Images</label>
        <input type="file" multiple accept="image/*" onChange={handleMultipleImages} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {product.images.map((img, idx) => (
            <img key={idx} src={img} alt={`gallery-${idx}`} className="w-16 h-16 object-cover" />
          ))}
        </div>

        {/* Variant Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Add Variant</h3>
          <div className="grid grid-cols-5 gap-2">
            <input placeholder="Color" value={newVariant.color} onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Size" value={newVariant.size} onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Stock" type="number" value={newVariant.stock} onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) })} className="p-2 border rounded" />
            <input placeholder="Price" type="number" value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) })} className="p-2 border rounded" />
            <input placeholder="SKU" value={newVariant.sku} onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })} className="p-2 border rounded" />
          </div>
          <button type="button" onClick={handleAddVariant} className="mt-2 px-4 py-1 bg-blue-600 text-white rounded">
            Add Variant
          </button>

          {/* Preview added variants */}
          <ul className="mt-3 text-sm text-gray-600">
            {product.variants.map((v, idx) => (
              <li key={idx}>
                {v.color} - {v.size} - {v.stock} units - ${v.price} - SKU: {v.sku}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Submit
        </button>
      </form>
    </div>
  );
}
