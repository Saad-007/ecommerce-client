import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { MdAdminPanelSettings } from "react-icons/md";
import { useProducts } from "../context/ProductContext";
import { useSearch } from "../context/SearchContext";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiGrid,
  FiChevronDown,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import {
  MdMale,
  MdFemale,
  MdChildCare,
  MdLaptop,
  MdPhoneIphone,
  MdHome,
  MdLocalOffer,
} from "react-icons/md";
import { BsGem } from "react-icons/bs";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const location = useLocation();
  
  const handleLogout = async () => {
    localStorage.removeItem("guestCart"); // Clear local guest cart

    await logout();
  };

  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchQuery("");
      setShowSuggestions(false); // optional: hide suggestions on page change
    }
  }, [location, setSearchQuery]);
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const categories = [
    {
      name: "Fashion",
      icon: <MdLocalOffer className="text-pink-500" />,
      subcategories: [
        { name: "Men's Fashion", icon: <MdMale />, path: "/category/male" },
        {
          name: "Women's Fashion",
          icon: <MdFemale />,
          path: "/category/female",
        },
        {
          name: "Kids & Babies",
          icon: <MdChildCare />,
          path: "/category/children",
        },
        { name: "Jewelry", icon: <BsGem />, path: "/category/jewelry" },
      ],
    },
    {
      name: "Electronics",
      icon: <MdLaptop className="text-blue-500" />,
      subcategories: [
        { name: "Phones", icon: <MdPhoneIphone />, path: "/category/phones" },
        { name: "Laptops", path: "/category/laptops" },
        { name: "Accessories", path: "/category/accessories" },
      ],
    },
    {
      name: "Home & Living",
      icon: <MdHome className="text-green-500" />,
      subcategories: [
        { name: "Furniture", path: "/category/furniture" },
        { name: "Kitchen", path: "/category/kitchen" },
        { name: "Decor", path: "/category/decor" },
      ],
    },
  ];

  // Update suggestions based on searchInput
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/search-results");
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    console.log("Navigating to product:", {
      id: product._id,
      name: product.name,
      existsInProducts: products.some((p) => p._id === product._id),
    });

    navigate(`/product/${product.id}`);
  };
  return (
    <nav
      className={`bg-white sticky top-0 z-50 border-b border-gray-100 transition-all duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      {/* Top Bar */}
      <div className="bg-gray-50 text-gray-600 py-2 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span>Summer Sale: Up to 50% off! 🎉</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin ? (
                  <Link
                    to="/admin/account"
                    className="hover:text-blue-500 transition-colors duration-200 flex items-center"
                  >
                    <MdAdminPanelSettings className="mr-1.5" size={14} /> Admin
                    Account
                  </Link>
                ) : (
                  user && (
                    <Link
                      to="/account"
                      className="hover:text-blue-500 transition-colors duration-200 flex items-center"
                    >
                      <FiUser className="mr-1.5" size={14} /> My Account
                    </Link>
                  )
                )}
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-500 transition-colors duration-200 flex items-center"
                >
                  <FiLogOut className="mr-1.5" size={14} /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-500 transition-colors duration-200 flex items-center"
                >
                  <FiUser className="mr-1.5" size={14} /> Login
                </Link>
                <Link
                  to="/signup"
                  className="hover:text-blue-500 transition-colors duration-200 flex items-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-semibold text-gray-900 flex items-center hover:opacity-90 transition-opacity"
            >
              <span className="bg-[#4c4c4c] text-white p-2 rounded-lg mr-3">
                <FiShoppingCart size={18} />
              </span>
              ShopPlus
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 ml-10">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-blue-600"
            >
              Home
            </Link>
            <Link
              to="/Home"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-blue-600"
            >
              Products
            </Link>
            <Link
              to="/Aboutus"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-blue-600"
            >
              About Us
            </Link>
          </div>

          {/* Search Bar with Categories Dropdown (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="flex w-full">
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                  className="h-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-l-lg border-r border-gray-200 flex items-center justify-between transition-colors duration-200"
                >
                  <span className="text-sm font-medium">All Categories</span>
                  <FiChevronDown
                    className={`ml-2 transition-transform ${
                      catDropdownOpen ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>

                {/* Categories Dropdown Menu */}
                {catDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg z-30 border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="py-1">
                      {categories.map((category) => (
                        <div
                          key={category.name}
                          className="border-b border-gray-100"
                        >
                          <div className="flex items-center px-4 py-2 font-medium text-gray-800">
                            {category.icon}
                            <span className="ml-2">{category.name}</span>
                          </div>
                          {category.subcategories.map((sub) => (
                            <button
                              key={sub.name}
                              onClick={() => {
                                navigate(sub.path);
                                setCatDropdownOpen(false);
                              }}
                              className="flex items-center w-full text-left px-8 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                            >
                              {sub.icon && (
                                <span className="mr-2">{sub.icon}</span>
                              )}
                              <span>{sub.name}</span>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className="relative flex-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    placeholder="Search for products..."
                    className="w-full border border-gray-200 py-2.5 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-20 left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto text-sm">
                      {suggestions.map((product) => (
                        <li
                          key={product._id}
                          onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                          onClick={() => {
                            const keyword = product.name; // or product.name.split(" ")[0] if you want only the first word
                            setSearchQuery(keyword);
                            navigate(
                              `/search?q=${encodeURIComponent(
                                product.name.split(" ")[0]
                              )}`
                            );
                            setShowSuggestions(false);
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-[#4c4c4c] hover:bg-gray-700 text-white px-4 py-2.5 rounded-r-lg transition-colors duration-200"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </div>

          {/* Icons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/wishlist"
              className="relative text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Wishlist"
            >
              <FiHeart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            {isAdmin && (
              <Link
                to="/admin/inventory"
                className="ml-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link to="/wishlist" className="relative text-gray-500">
              <FiHeart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-gray-500">
              <FiShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-500 focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-3 pb-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-2 text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md transition-colors duration-150 font-medium"
              >
                Home
              </Link>
              <Link
                to="/home"
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-2 text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md transition-colors duration-150 font-medium"
              >
                Products
              </Link>
              <Link
                to="/about-us"
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-2 text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md transition-colors duration-150 font-medium"
              >
                About Us
              </Link>
            </div>

            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <FiSearch size={18} />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <button
                onClick={() => setMobileCatOpen(!mobileCatOpen)}
                className="w-full flex justify-between items-center py-3 px-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md"
              >
                <div className="flex items-center">
                  <FiGrid className="text-gray-500 mr-2" size={18} />
                  Categories
                </div>
                <FiChevronDown
                  className={`transition-transform text-gray-400 ${
                    mobileCatOpen ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </button>

              {mobileCatOpen && (
                <div className="mt-2 ml-6 space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="pt-2">
                      <div className="flex items-center font-medium text-gray-900">
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </div>
                      <ul className="mt-1 ml-6 space-y-1">
                        {category.subcategories.map((subcat, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subcat.path}
                              onClick={() => setMenuOpen(false)}
                              className="block py-1.5 text-gray-600 hover:text-blue-500 transition-colors duration-150"
                            >
                              {subcat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Account Links */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 px-2 text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md transition-colors duration-150 flex items-center"
              >
                <FiUser className="mr-2" size={16} /> Account
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 px-2 text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md transition-colors duration-150 flex items-center"
              >
                <FiHeart className="mr-2" size={16} /> Wishlist
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/inventory"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 px-2 text-gray-900 font-medium hover:bg-gray-50 rounded-md"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
