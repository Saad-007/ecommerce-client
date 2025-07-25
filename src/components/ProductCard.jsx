import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FiShoppingCart, FiEye, FiTrash2 } from "react-icons/fi";
import { TbDiscount } from "react-icons/tb";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, isInWishlist = false }) {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    name,
    description,
    image,
    price,
    offerPrice,
    quantity = 0,
    sold = 0,
    status,
    reviews = []
  } = product;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/reviews?productId=${id}`, {
        credentials: "include", // if your backend requires auth cookies
      });
        const data = await res.json();
        const count = data.length;
        const avg = count
          ? data.reduce((sum, r) => sum + r.rating, 0) / count
          : 0;
        setReviewCount(count);
        setRating(avg);
      } catch (err) {
        console.error("Error fetching reviews in card:", err);
      }
    };

    if (product?.id) {
      fetchReviews();
    }
  }, [product.id]);

  const calculateDiscount = () => {
    if (offerPrice && offerPrice < price) {
      const percent = Math.round(((price - offerPrice) / price) * 100);
      return `${percent}% OFF`;
    }
    return null;
  };

  const handleAddToCart = () => {
    const itemToAdd = { ...product };
    addToCart({ ...itemToAdd });
  };

  const availabilityPercentage =
    quantity > 0 ? Math.round(((quantity - sold) / quantity) * 100) : 0;

  const getAvailabilityStatus = () => {
    if (quantity === 0) return "Out of Stock";
    if (availabilityPercentage < 20) return "Low Stock";
    if (availabilityPercentage < 50) return "Limited Stock";
    return "In Stock";
  };

  const getStatusColor = () => {
    if (quantity === 0) return "bg-gray-500";
    if (availabilityPercentage < 20) return "bg-red-500";
    if (availabilityPercentage < 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<IoStar key={i} className="text-yellow-400 w-4 h-4" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<IoStarHalf key={i} className="text-yellow-400 w-4 h-4" />);
      } else {
        stars.push(<IoStarOutline key={i} className="text-yellow-400 w-4 h-4" />);
      }
    }

    return stars;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative w-full bg-white rounded-xl shadow-lg overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
        {status && offerPrice && offerPrice < price && (
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="bg-[#4c4c4c] text-white text-xs font-medium px-3 py-1 rounded-full shadow-md flex items-center"
          >
            <TbDiscount className="mr-1" /> {calculateDiscount()}
          </motion.span>
        )}
      </div>

      {/* Premium Wishlist Button */}
      <div className="absolute top-4 right-4 z-10">
        {isInWishlist ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => removeFromWishlist(id)}
            className="p-2 rounded-full backdrop-blur-sm text-red-500 bg-white/90 shadow-md transition-all"
            aria-label="Remove from wishlist"
          >
            <FiTrash2 className="text-sm" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addToWishlist(product)}
            disabled={!status}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              wishlist.some((item) => item.id === product.id)
                ? "text-red-500 bg-white/90 shadow-md"
                : "text-gray-400 hover:text-[#4c4c4c] bg-white/80"
            } ${!status ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Add to wishlist"
          >
            <CiHeart className="text-lg" />
          </motion.button>
        )}
      </div>

      {/* Premium Product Image - Full Bleed */}
      <Link
        to={status ? `/product/${id}` : "#"}
        className="relative w-full aspect-square overflow-hidden block"
      >
        {image ? (
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-product.jpg";
              }}
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {!status && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white text-xs font-medium bg-[#4c4c4c]/90 px-3 py-1.5 rounded-full">
              Coming Soon
            </span>
          </div>
        )}

        {/* Quick View Button */}
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-sm"
          aria-label="Quick view"
        >
          <FiEye className="text-[#4c4c4c]" />
        </motion.button>
      </Link>

      {/* Premium Product Info */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex mr-2 text-amber-400">
            {renderStars()}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Title & Description */}
        <div className="mb-3">
          <h3 className="text-base font-medium text-gray-900 line-clamp-1 group-hover:text-[#4c4c4c] transition-colors">
            {name}
          </h3>
          <p className="text-gray-500 text-sm mt-1 min-h-[2.5rem] leading-snug line-clamp-2">
            {description || "Premium quality with exceptional craftsmanship"}
          </p>
        </div>

        {/* Availability */}
        {status && quantity > 0 && (
          <div className="mb-3">
            <span className={`${getStatusColor()} text-white text-xs font-medium px-2 py-1 rounded-full`}>
              {getAvailabilityStatus()}
            </span>
          </div>
        )}

        {/* Premium Pricing */}
        <div className="flex items-end gap-2 mb-4">
          {offerPrice && offerPrice < price ? (
            <>
              <span className="text-lg font-bold text-[#4c4c4c]">${offerPrice.toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">${price.toFixed(2)}</span>
              <span className="ml-auto text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                Save ${(price - offerPrice).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-[#4c4c4c]">${price.toFixed(2)}</span>
          )}
        </div>

        {/* Premium Add to Cart */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={!status}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all ${
            !status
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#4c4c4c] hover:bg-[#3a3a3a] text-white shadow-sm hover:shadow-md"
          }`}
        >
          <FiShoppingCart className="mr-2" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}