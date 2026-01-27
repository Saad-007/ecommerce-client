import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { MdAdminPanelSettings } from "react-icons/md";
import { useProducts } from "../context/ProductContext";
import { useSearch } from "../context/SearchContext";
import { useLocation } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiGrid,
  FiChevronDown,
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
  const location = useLocation();

  const handleLogout = async () => {
    localStorage.removeItem("guestCart");
    await logout();
  };

  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchQuery("");
      setShowSuggestions(false);
    }
  }, [location, setSearchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = user
    ? cart.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const categories = [
    {
      name: "Fashion",
      icon: <MdLocalOffer className="text-pink-500" size={14} />,
      subcategories: [
        { name: "Men", icon: <MdMale size={14} />, path: "/category/male" },
        {
          name: "Women",
          icon: <MdFemale size={14} />,
          path: "/category/female",
        },
        {
          name: "Kids",
          icon: <MdChildCare size={14} />,
          path: "/category/children",
        },
        {
          name: "Jewelry",
          icon: <BsGem size={14} />,
          path: "/category/jewelry",
        },
      ],
    },
    {
      name: "Electronics",
      icon: <MdLaptop className="text-blue-500" size={14} />,
      subcategories: [
        {
          name: "Phones",
          icon: <MdPhoneIphone size={14} />,
          path: "/category/phones",
        },
        { name: "Laptops", path: "/category/laptops" },
        { name: "Accessories", path: "/category/accessories" },
      ],
    },
    {
      name: "Home",
      icon: <MdHome className="text-green-500" size={14} />,
      subcategories: [
        { name: "Furniture", path: "/category/furniture" },
        { name: "Kitchen", path: "/category/kitchen" },
        { name: "Decor", path: "/category/decor" },
      ],
    },
  ];

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        catDropdownOpen &&
        !event.target.closest(".categories-dropdown-container")
      ) {
        setCatDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [catDropdownOpen]);

  return (
    <nav
      className={`bg-white top-0 z-50 border-b border-gray-100 transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      {/* Top Bar - Slimmed down */}
      <div className="bg-gray-50 text-gray-600 py-1 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>Summer Sale: Up to 50% off! 🎉</span>
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin/account"
                    className="hover:text-blue-500 transition-colors flex items-center"
                  >
                    <MdAdminPanelSettings className="mr-1" size={12} /> Admin
                  </Link>
                ) : (
                  <Link
                    to="/account"
                    className="hover:text-blue-500 transition-colors flex items-center"
                  >
                    <FiUser className="mr-1" size={12} /> Account
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-500 transition-colors flex items-center"
                >
                  <FiLogOut className="mr-1" size={12} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-500 transition-colors flex items-center"
                >
                  <FiUser className="mr-1" size={12} /> Login
                </Link>
                <Link
                  to="/signup"
                  className="hover:text-blue-500 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav - Compact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - Smaller */}
          <Link
            to="/"
            className="text-lg font-semibold text-gray-900 flex items-center"
          >
            <span className="bg-gray-800 text-white p-1.5 rounded-md mr-2">
              <FiShoppingCart size={16} />
            </span>
            ShopPlus
          </Link>

          {/* Desktop Navigation Links - Compact */}
          <div className="hidden lg:flex items-center space-x-6 ml-8">
            <Link
              to="/"
              className="text-sm text-gray-700 hover:text-[#4c4c4c] font-medium py-1.5 border-b-2 border-transparent hover:border-[#4c4c4c] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/Home"
              className="text-sm text-gray-700 hover:text-[#4c4c4c] font-medium py-1.5 border-b-2 border-transparent hover:border-[#4c4c4c] transition-colors"
            >
              Products
            </Link>
            {isAdmin && (
              <Link
                to="/orders"
                className="text-sm text-gray-700 hover:text-[#4c4c4c] font-medium py-1.5 border-b-2 border-transparent hover:border-[#4c4c4c] transition-colors"
              >
                Orders
              </Link>
            )}
            <Link
              to="/Aboutus"
              className="text-sm text-gray-700 hover:text-[#4c4c4c] font-medium py-1.5 border-b-2 border-transparent hover:border-[#4c4c4c] transition-colors"
            >
              About
            </Link>
          </div>

          {/* Search Bar - Compact */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative flex w-full">
              {/* Categories Dropdown */}
              <div className="relative categories-dropdown-container">
                <button
                  onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                  className="h-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-l-md border-r border-gray-200 flex items-center text-xs font-medium"
                >
                  Categories
                  <FiChevronDown
                    className={`ml-1 transition-transform ${
                      catDropdownOpen ? "rotate-180" : ""
                    }`}
                    size={14}
                  />
                </button>

                {/* Categories Dropdown Menu */}
                {catDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-56 bg-white rounded-md shadow-lg z-30 border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="py-1">
                      {categories.map((category) => (
                        <div
                          key={category.name}
                          className="border-b border-gray-100"
                        >
                          <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-800">
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
                              className="flex items-center w-full text-left px-6 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600"
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
                  placeholder="Search products..."
                  className="w-full border border-gray-200 py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs placeholder-gray-400"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-20 left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto text-xs">
                    {suggestions.map((product) => (
                      <li
                        key={product._id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchQuery(product.name.split(" ")[0]);
                          navigate(
                            `/search?q=${encodeURIComponent(
                              product.name.split(" ")[0]
                            )}`
                          );
                          setShowSuggestions(false);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-r-md transition-colors"
              >
                <FiSearch size={16} />
              </button>
            </div>
          </div>

          {/* Icons - Compact */}
          <div className="hidden lg:flex items-center space-x-5">
            {user && !isAdmin && (
              <>
                {/* Wishlist Link */}
                <Link
                  to="/wishlist"
                  className="relative text-gray-500 hover:text-gray-700"
                >
                  <FiHeart size={18} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Cart Link */}
                <Link
                  to="/cart"
                  className="relative text-gray-500 hover:text-gray-700"
                >
                  <FiShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin/inventory"
                className="ml-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md hover:bg-gray-700 transition-all"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {user && !isAdmin && (
              <>
                <Link to="/wishlist" className="relative text-gray-500">
                  <FiHeart size={18} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative text-gray-500">
                  <FiShoppingCart size={18} />
                  {user && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-500 focus:outline-none"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search and Categories - Always visible on mobile */}
      <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-2">
        {/* Mobile Search */}
        <div className="relative mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search products..."
            className="w-full border border-gray-200 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <FiSearch size={16} />
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-20 left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto text-xs">
              {suggestions.map((product) => (
                <li
                  key={product._id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSearchQuery(product.name.split(" ")[0]);
                    navigate(
                      `/search?q=${encodeURIComponent(
                        product.name.split(" ")[0]
                      )}`
                    );
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile Categories */}
        <div>
          <button
            onClick={() => setMobileCatOpen(!mobileCatOpen)}
            className="w-full flex justify-between items-center py-2 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
          >
            <div className="flex items-center">
              <FiGrid className="text-gray-500 mr-2" size={16} />
              Categories
            </div>
            <FiChevronDown
              className={`transition-transform text-gray-400 ${
                mobileCatOpen ? "rotate-180" : ""
              }`}
              size={14}
            />
          </button>

          {mobileCatOpen && (
            <div className="mt-1 ml-5 space-y-1">
              {categories.map((category, index) => (
                <div key={index} className="pt-1">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </div>
                  <ul className="mt-1 ml-5 space-y-0.5">
                    {category.subcategories.map((subcat, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={subcat.path}
                          onClick={() => {
                            setMobileCatOpen(false);
                            setMenuOpen(false);
                          }}
                          className="block py-1 text-xs text-gray-600 hover:text-blue-500"
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
      </div>

      {/* Mobile Menu - Compact */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-3 space-y-3">
            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-2 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded transition-colors"
              >
                Home
              </Link>
              <Link
                to="/home"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-2 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded transition-colors"
              >
                Products
              </Link>
              {isAdmin && (
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-2 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded transition-colors"
                >
                  Orders
                </Link>
              )}
              <Link
                to="/about-us"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-2 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded transition-colors"
              >
                About Us
              </Link>
            </div>

            {/* Mobile Account Links */}
            <div className="border-t border-gray-100 pt-2 space-y-1">
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-2 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded flex items-center"
              >
                <FiUser className="mr-2" size={14} /> Account
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-2 text-sm text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded flex items-center"
              >
                <FiHeart className="mr-2" size={14} /> Wishlist
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/inventory"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-2 text-sm text-gray-900 font-medium hover:bg-gray-50 rounded"
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
