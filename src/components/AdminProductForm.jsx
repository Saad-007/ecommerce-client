import React, { useState } from "react";

const categories = ["Male", "Female", "Children", "Others"];

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Basic validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || isNaN(formData.price)) newErrors.price = "Valid price required";
    if (!formData.description.trim()) newErrors.description = "Description required";
    if (!formData.image) newErrors.image = "Product image required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // On form submit
 const handleSubmit = (e) => {
  e.preventDefault();
  if (!validate()) return;

  const newProduct = {
    id: Date.now(), // Optional: gives unique ID
    name: formData.name,
    category: formData.category,
    price: parseFloat(formData.price),
    description: formData.description,
    image: imagePreview,
  };

  addProduct(newProduct); // ✅ Now works, since newProduct is defined

  setProducts((prev) => [...prev, newProduct]);

  // Reset form
  setFormData({
    name: "",
    category: "",
    price: "",
    description: "",
    image: null,
  });
  setImagePreview(null);
  setErrors({});
};


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1" htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-blue-500 transition ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-blue-500 transition ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="price">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-blue-500 transition ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter price"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-blue-500 transition resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Write product description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className={`w-full focus:outline-blue-500 transition ${
                errors.image ? "border-red-500" : ""
              }`}
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 max-h-40 object-contain rounded-lg border"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="max-w-xl mx-auto mt-12">
        <h3 className="text-xl font-bold mb-4">Products Added:</h3>
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products added yet.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((p, i) => (
              <li
                key={i}
                className="bg-white p-4 rounded shadow flex gap-4 items-center"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold">{p.name}</h4>
                  <p className="text-sm text-gray-600">{p.category}</p>
                  <p className="text-sm">${p.price.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
