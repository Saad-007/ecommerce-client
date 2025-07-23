import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { FiUpload, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { TbDiscount } from "react-icons/tb";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categories = [
  { value: "male", label: "Men's Fashion" },
  { value: "female", label: "Women's Fashion" },
  { value: "children", label: "Kids & Babies" },
  { value: "laptop", label: "Laptop" },
  { value: "accessories", label: "Accessories" },
  { value: "home", label: "Home & Living" },
  { value: "home", label: "Home & Living" },

];

const colors = [
  { value: "red", label: "Red", hex: "#ef4444" },
  { value: "blue", label: "Blue", hex: "#3b82f6" },
  { value: "green", label: "Green", hex: "#22c55e" },
  { value: "black", label: "Black", hex: "#000000" },
  { value: "white", label: "White", hex: "#ffffff" },
  { value: "yellow", label: "Yellow", hex: "#facc15" },
  { value: "pink", label: "Pink", hex: "#ec4899" },
  { value: "purple", label: "Purple", hex: "#a855f7" },
  { value: "gray", label: "Gray", hex: "#6b7280" },
  { value: "brown", label: "Brown", hex: "#92400e" },
];

const sizes = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "xxl", label: "XXL" },
  { value: "xxxl", label: "XXXL" },
];

const shippingMethods = [
  { value: "free", label: "Free Shipping", price: 0 },
  { value: "standard", label: "Standard Shipping", price: 5.99 },
  { value: "express", label: "Express Shipping", price: 12.99 },
  { value: "international", label: "International Shipping", price: 24.99 },
];

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();

  const productToEdit = products.find((p) => String(p._id) === id);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    offerPrice: "",
    description: "",
    quantity: "0",
    sold: "0",
    variants: [],
    tags: [],
    image: null,
    status: true,
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    shipping: {
      methods: ["standard"],
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      processingTime: "1-3 business days",
    },
  });

  const [variantInput, setVariantInput] = useState({
    color: "",
    sizes: [],
    stock: "",
    price: "",
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkStock, setBulkStock] = useState("");

  useEffect(() => {
    if (productToEdit) {
      // Convert shipping methods array to format expected by the form
      const shippingMethodsArray = productToEdit.shipping.methods
        ? productToEdit.shipping.methods.map((m) => m.type)
        : ["standard"];

      setFormData({
        ...productToEdit,
        shipping: {
          ...productToEdit.shipping,
          methods: shippingMethodsArray,
        },
      });

      if (productToEdit.image) {
        setPreview(productToEdit.image);
      }
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "image" && files && files.length > 0) {
      const file = files[0];

      if (!file.type.match("image.*")) {
        toast.error("Please select an image file (JPEG, PNG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else if (name.startsWith("shipping.")) {
      const field = name.split(".")[1];
      if (field === "dimensions") {
        const dimension = name.split(".")[2];
        setFormData((prev) => ({
          ...prev,
          shipping: {
            ...prev.shipping,
            dimensions: {
              ...prev.shipping.dimensions,
              [dimension]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          shipping: {
            ...prev.shipping,
            [field]: value,
          },
        }));
      }
    } else if (name.startsWith("dimensions.")) {
      const dimension = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimension]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleShippingMethod = (method) => {
    setFormData((prev) => {
      const methods = [...prev.shipping.methods];
      if (methods.includes(method)) {
        return {
          ...prev,
          shipping: {
            ...prev.shipping,
            methods: methods.filter((m) => m !== method),
          },
        };
      } else {
        return {
          ...prev,
          shipping: {
            ...prev.shipping,
            methods: [...methods, method],
          },
        };
      }
    });
  };

  const toggleSizeSelection = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const addBulkVariants = () => {
    if (!variantInput.color || selectedSizes.length === 0 || !bulkStock) {
      toast.error("Please select color, sizes, and enter stock quantity");
      return;
    }

    const newVariants = selectedSizes.map((size) => ({
      id: Math.random().toString(36).substr(2, 9),
      color: variantInput.color,
      size: size,
      stock: parseInt(bulkStock),
      price: variantInput.price
        ? parseFloat(variantInput.price)
        : parseFloat(formData.price),
      sku: `${formData.name.substring(0, 3).toUpperCase()}-${
        variantInput.color
      }-${size}`,
    }));

    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, ...newVariants],
      quantity:
        parseInt(prev.quantity) + parseInt(bulkStock) * selectedSizes.length,
    }));

    setVariantInput((prev) => ({ ...prev, color: "", price: "" }));
    setSelectedSizes([]);
    setBulkStock("");
  };

  const removeVariant = (id) => {
    setFormData((prev) => {
      const variant = prev.variants.find((v) => v.id === id);
      return {
        ...prev,
        variants: prev.variants.filter((v) => v.id !== id),
        quantity: parseInt(prev.quantity) - (variant?.stock || 0),
      };
    });
  };

  const updateVariantStock = (id, newStock) => {
    setFormData((prev) => {
      const variantIndex = prev.variants.findIndex((v) => v.id === id);
      if (variantIndex === -1) return prev;

      const oldStock = prev.variants[variantIndex].stock;
      const stockDiff = parseInt(newStock) - oldStock;

      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        stock: parseInt(newStock),
      };

      return {
        ...prev,
        variants: updatedVariants,
        quantity: parseInt(prev.quantity) + stockDiff,
      };
    });
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }));
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageData = formData.image;
      
      // Only convert to base64 if it's a new file (not the existing image string)
      if (imageData instanceof File) {
        imageData = await toBase64(imageData);
      }

      const updatedProduct = {
        ...formData,
        id: productToEdit.id, // Keep the original ID
        image: imageData,
        price: parseFloat(formData.price),
        offerPrice: formData.offerPrice
          ? parseFloat(formData.offerPrice)
          : null,
        quantity: parseInt(formData.quantity),
        sold: parseInt(formData.sold),
        weight: parseFloat(formData.weight) || 0,
        dimensions: {
          length: parseFloat(formData.dimensions.length) || 0,
          width: parseFloat(formData.dimensions.width) || 0,
          height: parseFloat(formData.dimensions.height) || 0,
        },
        shipping: {
          ...formData.shipping,
          weight: parseFloat(formData.shipping.weight) || 0,
          dimensions: {
            length: parseFloat(formData.shipping.dimensions.length) || 0,
            width: parseFloat(formData.shipping.dimensions.width) || 0,
            height: parseFloat(formData.shipping.dimensions.height) || 0,
          },
          methods: formData.shipping.methods.map((method) => ({
            type: method,
            price: shippingMethods.find((m) => m.value === method)?.price || 0,
          })),
        },
      };

      await updateProduct(updatedProduct);
      toast.success("Product updated successfully!");
      navigate("/admin/inventory");
    } catch (error) {
      toast.error(`Error updating product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  if (!productToEdit) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-center text-red-600 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Edit Product</h1>
              <button
                onClick={() => navigate("/admin/inventory")}
                className="text-blue-100 hover:text-white transition-colors flex items-center"
              >
                <FiX className="mr-1" /> Cancel
              </button>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2 border-b pb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-b pb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Pricing
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Price ($) *
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="number"
                          name="price"
                          min="0.01"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          className="block w-full pl-7 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offer Price ($)
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="number"
                          name="offerPrice"
                          min="0.01"
                          step="0.01"
                          value={formData.offerPrice}
                          onChange={handleChange}
                          className="block w-full pl-7 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <TbDiscount className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="status"
                        name="status"
                        type="checkbox"
                        checked={formData.status}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="status"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Active Product
                      </label>
                    </div>
                  </div>
                </div>

                {/* Variants */}
                <div className="md:col-span-2 border-b pb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Product Variants
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800 mb-3">
                        Quick Add Variants
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color *
                          </label>
                          <select
                            value={variantInput.color}
                            onChange={(e) =>
                              setVariantInput((prev) => ({
                                ...prev,
                                color: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Color</option>
                            {colors.map((color) => (
                              <option key={color.value} value={color.value}>
                                {color.label}
                              </option>
                            ))}
                          </select>
                          {variantInput.color && (
                            <div className="mt-1 flex items-center">
                              <span
                                className="inline-block w-4 h-4 rounded-full mr-2"
                                style={{
                                  backgroundColor: colors.find(
                                    (c) => c.value === variantInput.color
                                  )?.hex,
                                }}
                              ></span>
                              <span className="text-xs text-gray-500">
                                {
                                  colors.find(
                                    (c) => c.value === variantInput.color
                                  )?.label
                                }
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sizes *
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                              <button
                                key={size.value}
                                type="button"
                                onClick={() => toggleSizeSelection(size.value)}
                                className={`px-3 py-1 text-sm rounded-md border ${
                                  selectedSizes.includes(size.value)
                                    ? "bg-blue-100 border-blue-500 text-blue-800"
                                    : "bg-white border-gray-300 text-gray-700"
                                }`}
                              >
                                {size.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock per Size *
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={bulkStock}
                            onChange={(e) => setBulkStock(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Quantity for each size"
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Variant Price (optional)
                          </label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={variantInput.price}
                            onChange={(e) =>
                              setVariantInput((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Leave empty to use base price"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={addBulkVariants}
                            disabled={
                              !variantInput.color ||
                              selectedSizes.length === 0 ||
                              !bulkStock
                            }
                            className={`px-4 py-2 rounded-md text-white font-medium ${
                              !variantInput.color ||
                              selectedSizes.length === 0 ||
                              !bulkStock
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            <FiPlus className="inline mr-1" /> Add Variants
                          </button>
                        </div>
                      </div>
                    </div>

                    {formData.variants.length > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium text-gray-700">
                            Current Variants
                          </h3>
                          <span className="text-sm text-gray-500">
                            Total Stock: {formData.quantity}
                          </span>
                        </div>

                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Color
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Size
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Price
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Stock
                                </th>
                                <th className="relative py-3 pl-3 pr-4 sm:pr-6"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {formData.variants.map((variant) => (
                                <tr key={variant.id}>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                    <div className="flex items-center">
                                      <span
                                        className="inline-block w-3 h-3 rounded-full mr-2"
                                        style={{
                                          backgroundColor: colors.find(
                                            (c) => c.value === variant.color
                                          )?.hex,
                                        }}
                                      ></span>
                                      {
                                        colors.find(
                                          (c) => c.value === variant.color
                                        )?.label
                                      }
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {
                                      sizes.find(
                                        (s) => s.value === variant.size
                                      )?.label
                                    }
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    $
                                    {typeof variant.price === "number"
                                      ? variant.price.toFixed(2)
                                      : parseFloat(variant.price || 0).toFixed(
                                          2
                                        )}
                                  </td>

                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <input
                                      type="number"
                                      min="0"
                                      value={variant.stock}
                                      onChange={(e) =>
                                        updateVariantStock(
                                          variant.id,
                                          e.target.value
                                        )
                                      }
                                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </td>
                                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <button
                                      type="button"
                                      onClick={() => removeVariant(variant.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="md:col-span-2 border-b pb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Shipping Methods *
                      </label>
                      <div className="space-y-2">
                        {shippingMethods.map((method) => (
                          <div key={method.value} className="flex items-center">
                            <input
                              id={`shipping-${method.value}`}
                              name="shippingMethods"
                              type="checkbox"
                              checked={formData.shipping.methods.includes(
                                method.value
                              )}
                              onChange={() =>
                                toggleShippingMethod(method.value)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`shipping-${method.value}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {method.label} (${method.price.toFixed(2)})
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Processing Time
                      </label>
                      <select
                        name="shipping.processingTime"
                        value={formData.shipping.processingTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1-3 business days">
                          1-3 business days
                        </option>
                        <option value="3-5 business days">
                          3-5 business days
                        </option>
                        <option value="5-7 business days">
                          5-7 business days
                        </option>
                        <option value="7-10 business days">
                          7-10 business days
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Package Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="shipping.weight"
                        min="0"
                        step="0.01"
                        value={formData.shipping.weight}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Package Dimensions (cm)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input
                            type="number"
                            name="shipping.dimensions.length"
                            min="0"
                            step="0.1"
                            value={formData.shipping.dimensions.length}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Length"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            name="shipping.dimensions.width"
                            min="0"
                            step="0.1"
                            value={formData.shipping.dimensions.width}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Width"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            name="shipping.dimensions.height"
                            min="0"
                            step="0.1"
                            value={formData.shipping.dimensions.height}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Height"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Image */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Product Image
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-3 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          id="image-upload"
                          name="image"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </label>
                    </div>

                    {(preview || formData.image) && (
                      <div className="relative w-full max-w-xs mx-auto">
                        <img
                          src={preview || formData.image}
                          alt="Preview"
                          className="rounded-lg border border-gray-200 w-full h-48 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, image: null }));
                            setPreview(null);
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        >
                          <FiX className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Product Tags
                  </h2>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add tags (press Enter)"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-md text-white font-medium ${
                    isSubmitting
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}