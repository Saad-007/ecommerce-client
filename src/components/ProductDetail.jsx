import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import ProductCard from "./ProductCard";
import {
  FiHeart,
  FiShare2,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiTag,
} from "react-icons/fi";
import { TbDiscount } from "react-icons/tb";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    name: "",
    email: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reviews?productId=${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();

        const reviewsData = data.map((review) => ({
          ...review,
          createdAt: new Date(review.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          id: review._id || review.id,
        }));

        const totalRating = reviewsData.reduce((sum, r) => sum + r.rating, 0);
        setReviews(reviewsData);
        setAverageRating(
          reviewsData.length ? totalRating / reviewsData.length : 0
        );
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        toast.error("Failed to load reviews");
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  const product = products?.find((p) => String(p.id) === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md p-8 bg-white rounded-2xl shadow-xl text-center">
          <div className="text-6xl mb-6 text-red-500">❌</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            ← Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const {
    name,
    description,
    price,
    offerPrice,
    variants = [],
    tags = [],
    category,
    weight,
    dimensions,
    shipping,
    image,
    images: rawImages = [],
  } = product;

  const images =
    Array.isArray(rawImages) && rawImages.length
      ? rawImages.filter((img) => typeof img === "string")
      : image
      ? [image]
      : [];

  // Get available colors and sizes from variants
  const availableColors = [...new Set(variants.map((v) => v.color))]
    .map((color) => colors.find((c) => c.value === color))
    .filter(Boolean);

  const availableSizes = [...new Set(variants.map((v) => v.size))]
    .map((size) => sizes.find((s) => s.value === size))
    .filter(Boolean);

  // Filter variants based on selected color and size
  const filteredVariants = variants.filter((variant) => {
    if (selectedColor && variant.color !== selectedColor) return false;
    if (selectedSize && variant.size !== selectedSize) return false;
    return true;
  });

  // Get selected variant (if both color and size are selected)
  const selectedVariant =
    selectedColor && selectedSize
      ? variants.find(
          (v) => v.color === selectedColor && v.size === selectedSize
        )
      : null;

  const discount =
    offerPrice && offerPrice < price
      ? `${Math.round(((price - offerPrice) / price) * 100)}% OFF`
      : null;

  const handleAddToCart = () => {
    const itemToAdd = selectedVariant
      ? { ...product, variant: selectedVariant }
      : product;
    addToCart({ ...itemToAdd, quantity });
    toast.success(`${quantity} ${name} added to cart!`, {
      position: "bottom-right",
    });
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= (selectedVariant?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      !isWishlisted ? "Added to your wishlist!" : "Removed from your wishlist"
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          productName: name,
          rating: newReview.rating,
          comment: newReview.comment,
          name: newReview.name,
          email: newReview.email,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      const createdReview = await response.json();

      const updatedReviews = [
        {
          ...createdReview,
          createdAt: new Date(createdReview.createdAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          ),
          id: createdReview._id || createdReview.id,
        },
        ...reviews,
      ];

      const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);

      setReviews(updatedReviews);
      setAverageRating(totalRating / updatedReviews.length);
      setNewReview({
        rating: 5,
        comment: "",
        name: "",
        email: "",
      });
      setShowReviewForm(false);

      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error(error.message || "Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FiStar
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Glass Morphism Card Effect */}
        <motion.div
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <div className="px-8 py-5 bg-gray-50/80 border-b border-gray-200">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <motion.li whileHover={{ x: -2 }}>
                  <Link
                    to="/"
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Home
                  </Link>
                </motion.li>
                <li>
                  <span className="text-gray-400">/</span>
                </li>
                <motion.li whileHover={{ x: -2 }}>
                  <Link
                    to={`/category/${category}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 capitalize"
                  >
                    {category}
                  </Link>
                </motion.li>
                <li>
                  <span className="text-gray-400">/</span>
                </li>
                <li className="text-gray-700 font-medium truncate max-w-xs">
                  {name}
                </li>
              </ol>
            </nav>
          </div>

          <div className="grid md:grid-cols-2 gap-12 p-8">
            {/* Product Image Gallery - Improved Layout */}
            <div className="relative">
              {/* Main Image Container with Perfect Aspect Ratio */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {images && images.length > 0 ? (
                  <>
                    {/* Main Image with Smooth Transitions */}
                    <motion.div
                      key={activeImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={images[activeImageIndex]}
                        alt={name}
                        className="w-full h-full object-contain transition-opacity duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-product-image.jpg";
                        }}
                      />
                    </motion.div>

                    {/* Navigation Arrows - Desktop */}
                    {images.length > 1 && (
                      <>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) =>
                              prev === 0 ? images.length - 1 : prev - 1
                            );
                          }}
                          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiChevronLeft className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) =>
                              prev === images.length - 1 ? 0 : prev + 1
                            );
                          }}
                          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiChevronRight className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 rounded-xl">
                    <FiImage className="w-12 h-12 mb-3 opacity-60" />
                    <span className="text-sm md:text-base">
                      No image available
                    </span>
                  </div>
                )}

                {/* Floating Tags */}
                {tags.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                    {tags.map((tag) => (
                      <motion.span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm shadow-sm text-gray-800 border border-gray-200/80 hover:border-gray-300"
                        whileHover={{ y: -2, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiTag className="mr-1.5 w-3 h-3" />
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Discount Badge with Glow */}
                {discount && (
                  <motion.div
                    className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-3 py-1 rounded-full flex items-center shadow-lg z-10"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TbDiscount className="mr-1.5 w-4 h-4" />
                    <span className="font-medium">{discount}</span>
                  </motion.div>
                )}

                {/* Mobile Swipe Indicator */}
                {images && images.length > 1 && (
                  <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeImageIndex === index
                            ? "bg-blue-500 w-4"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation - Improved Layout */}
              {images && images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {images.map((img, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                        activeImageIndex === index
                          ? "border-blue-500 shadow-md"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={img}
                        alt={`${name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-thumbnail.jpg";
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <motion.h1
                  className="text-3xl font-bold text-gray-900"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {name}
                </motion.h1>

                <div className="flex space-x-2">
                  <motion.button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      isWishlisted
                        ? "text-red-500 bg-red-50 hover:bg-red-100"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Add to wishlist"
                  >
                    <FiHeart
                      className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  </motion.button>

                  <motion.button
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Share product"
                  >
                    <FiShare2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>

              {/* Price + Discount */}
              <motion.div
                className="flex items-center gap-4 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-green-600 font-bold text-2xl">
                  $
                  {selectedVariant?.price
                    ? selectedVariant.price.toFixed(2)
                    : (offerPrice || price).toFixed(2)}
                </p>
                {(offerPrice || selectedVariant?.price) && (
                  <p className="line-through text-gray-400">
                    ${price.toFixed(2)}
                  </p>
                )}
                {(offerPrice || selectedVariant?.price) && (
                  <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                    Save $
                    {(price - (selectedVariant?.price || offerPrice)).toFixed(2)}
                  </span>
                )}
              </motion.div>

              {/* Variants */}
              {variants.length > 0 && (
                <motion.div
                  className="space-y-6 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Color Selection */}
                  {availableColors.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-700">
                        Color
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {availableColors.map((color) => (
                          <motion.button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                              selectedColor === color.value
                                ? "border-blue-500 shadow-md"
                                : "border-transparent hover:border-gray-300"
                            }`}
                            style={{ backgroundColor: color.hex }}
                            aria-label={color.label}
                            title={color.label}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="sr-only">{color.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {availableSizes.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-700">
                        Size
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {availableSizes.map((size) => {
                          const variantStock =
                            variants.find(
                              (v) =>
                                (selectedColor
                                  ? v.color === selectedColor
                                  : true) && v.size === size.value
                            )?.stock || 0;

                          return (
                            <motion.button
                              key={size.value}
                              onClick={() => setSelectedSize(size.value)}
                              disabled={variantStock <= 0}
                              className={`px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
                                selectedSize === size.value
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : variantStock > 0
                                  ? "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                  : "border-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                              whileHover={{ y: variantStock > 0 ? -2 : 0 }}
                            >
                              {size.label}
                              {variantStock > 0 && (
                                <span className="ml-1 text-xs text-gray-500">
                                  ({variantStock} left)
                                </span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selected Variant Info */}
                  {selectedVariant && (
                    <motion.div
                      className="bg-blue-50 p-4 rounded-lg border border-blue-100"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium">Selected:</span>{" "}
                          {
                            colors.find(
                              (c) => c.value === selectedVariant.color
                            )?.label
                          }
                          ,{" "}
                          {
                            sizes.find((s) => s.value === selectedVariant.size)
                              ?.label
                          }
                        </div>
                        <button
                          onClick={() => {
                            setSelectedColor(null);
                            setSelectedSize(null);
                          }}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <FiX />
                        </button>
                      </div>
                      {selectedVariant.sku && (
                        <div className="text-xs text-gray-600 mt-1">
                          SKU: {selectedVariant.sku}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Quantity Selector */}
              <motion.div
                className="flex items-center space-x-4 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-sm font-medium text-gray-700">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <motion.button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3.5 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                    disabled={quantity <= 1}
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </motion.button>
                  <span className="px-4 py-2 text-center w-12 border-x border-gray-300">
                    {quantity}
                  </span>
                  <motion.button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3.5 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                    disabled={quantity >= (selectedVariant?.stock || 10)}
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </motion.button>
                </div>
                <span className="text-sm text-gray-500">
                  Max: {selectedVariant?.stock || 10}
                </span>
              </motion.div>

              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                disabled={variants.length > 0 && !selectedVariant}
                className={`w-full px-6 py-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center space-x-3 mt-6 ${
                  variants.length > 0 && !selectedVariant
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg"
                }`}
                whileHover={{
                  y: variants.length > 0 && !selectedVariant ? 0 : -2,
                }}
                whileTap={{
                  scale: variants.length > 0 && !selectedVariant ? 1 : 0.98,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-medium">🛒 Add to Cart</span>
                {(offerPrice || selectedVariant?.price) && (
                  <span className="text-sm font-normal opacity-90">
                    Save $
                    {(
                      (price - (selectedVariant?.price || offerPrice)) *
                      quantity
                    ).toFixed(2)}
                  </span>
                )}
              </motion.button>

              {/* Shipping Information */}
              {shipping && (
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Shipping Options
                  </h3>
                  <div className="space-y-3">
                    {shipping.methods.map((method) => {
                      const methodInfo = shippingMethods.find(
                        (m) => m.value === method.type
                      );
                      return (
                        <div
                          key={method.type}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-600">
                            {methodInfo?.label || method.type}
                          </span>
                          <span className="font-medium">
                            {method.price > 0
                              ? `$${method.price.toFixed(2)}`
                              : "FREE"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    Processing time: {shipping.processingTime}
                  </div>
                </div>
              )}

              {/* Product Details Sections */}
              <div className="space-y-4 mt-6">
                {/* Description Section */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => toggleSection("description")}
                    className="flex justify-between items-center w-full text-left font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200"
                  >
                    <span>Description</span>
                    {expandedSection === "description" ? (
                      <FiChevronUp className="h-5 w-5" />
                    ) : (
                      <FiChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "description" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 text-gray-600 overflow-hidden"
                      >
                        {description || "No description available."}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Specifications Section */}
                {(weight || dimensions) && (
                  <div className="border-b border-gray-200 pb-4">
                    <button
                      onClick={() => toggleSection("specifications")}
                      className="flex justify-between items-center w-full text-left font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200"
                    >
                      <span>Specifications</span>
                      {expandedSection === "specifications" ? (
                        <FiChevronUp className="h-5 w-5" />
                      ) : (
                        <FiChevronDown className="h-5 w-5" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedSection === "specifications" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 text-gray-600 grid grid-cols-2 gap-y-2 overflow-hidden"
                        >
                          {weight && (
                            <>
                              <span className="text-gray-700">Weight:</span>
                              <span>{weight} kg</span>
                            </>
                          )}
                          {dimensions?.length && (
                            <>
                              <span className="text-gray-700">Length:</span>
                              <span>{dimensions.length} cm</span>
                            </>
                          )}
                          {dimensions?.width && (
                            <>
                              <span className="text-gray-700">Width:</span>
                              <span>{dimensions.width} cm</span>
                            </>
                          )}
                          {dimensions?.height && (
                            <>
                              <span className="text-gray-700">Height:</span>
                              <span>{dimensions.height} cm</span>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="pt-6 flex justify-between">
                <motion.div whileHover={{ x: -2 }}>
                  <Link
                    to="/"
                    className="text-blue-600 hover:underline flex items-center text-sm font-medium transition-colors duration-200"
                  >
                    ← Continue Shopping
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 2 }}>
                  <Link
                    to="/cart"
                    className="text-blue-600 hover:underline flex items-center text-sm font-medium transition-colors duration-200"
                  >
                    View Cart →
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* You May Also Like Section */}
          <div className="border-t border-gray-200 px-4 sm:px-8 py-12 bg-gray-50/80">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                You May Also Like
              </h2>

              {/* Mobile Carousel */}
              <div className="lg:hidden relative overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar">
                <div className="flex space-x-4 w-max">
                  {products
                    .filter(
                      (p) =>
                        p.category === product.category && p.id !== product.id
                    )
                    .slice(0, 6)
                    .map((relatedProduct) => (
                      <div
                        key={relatedProduct.id}
                        className="w-[calc(50vw-1.5rem)] sm:w-[calc(33.3vw-1.5rem)] flex-shrink-0 snap-start"
                      >
                        <motion.div
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="h-full"
                        >
                          <ProductCard
                            product={relatedProduct}
                            className="h-full"
                          />
                        </motion.div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Desktop Grid */}
              <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products
                  .filter(
                    (p) =>
                      p.category === product.category && p.id !== product.id
                  )
                  .slice(0, 4)
                  .map((relatedProduct) => (
                    <motion.div
                      key={relatedProduct.id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard
                        product={relatedProduct}
                        className="h-full"
                      />
                    </motion.div>
                  ))}
              </div>

              {products.filter(
                (p) => p.category === product.category && p.id !== product.id
              ).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No related products found in this category.
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 px-4 sm:px-6 py-6 bg-gray-50/80">
            <div className="flex flex-col justify-between items-start mb-6">
              <div className="w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Customer Reviews
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 gap-2">
                  <div className="flex">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} out of 5 ({reviews.length}{" "}
                    reviews)
                  </span>
                </div>
              </div>
              <motion.button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="mt-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </motion.button>
            </div>

            {/* Review Form */}
            <AnimatePresence>
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-white rounded-lg p-4 sm:p-6 overflow-hidden shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-medium mb-4 text-gray-900">
                    Share Your Experience
                  </h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex justify-center sm:justify-start">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setNewReview({ ...newReview, rating: star })
                            }
                            className="p-1"
                          >
                            <FiStar
                              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                star <= newReview.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Review
                      </label>
                      <textarea
                        id="comment"
                        rows="3"
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        required
                        minLength="10"
                        placeholder="Share your thoughts about this product..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          value={newReview.name}
                          onChange={(e) =>
                            setNewReview({ ...newReview, name: e.target.value })
                          }
                          required
                          minLength="2"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          value={newReview.email}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              email: e.target.value,
                            })
                          }
                          required
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <motion.button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center text-sm font-medium shadow-sm transition-all duration-200"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          "Submit Review"
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.name}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center mt-1 gap-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-gray-500">
                            {review.createdAt}
                          </span>
                        </div>
                      </div>
                      {review.email && (
                        <span className="text-xs text-gray-500 break-all">
                          {review.email}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-3 text-sm sm:text-base">
                      {review.comment}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 bg-white rounded-lg p-4 sm:p-6 border border-gray-100 text-sm sm:text-base">
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}