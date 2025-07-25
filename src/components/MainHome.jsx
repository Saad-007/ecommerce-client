import React, { useEffect, useState ,useRef } from "react";
import Slider from "react-slick";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useAuth } from "../context/AuthContext";
import 'swiper/css';
import { useSearch } from "../context/SearchContext";

import 'swiper/css/navigation';
import { 
  FiShoppingBag, 
  FiArrowRight, 
  FiStar,
  FiX,
  FiTruck,
  FiChevronLeft ,
  FiChevronRight ,
  FiInfo ,
  FiAward,
  FiShield,
  FiCreditCard,
  FiHeadphones,
  FiEdit3
} from "react-icons/fi";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { getHeroSlides } from "../api/hero";

const MainHome = () => {
  const { isAdmin, user } = useAuth();
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const controls = useAnimation();
  const { products, featuredProducts, loading: productsLoading, toggleFeatured } = useProducts();
 const [error, setError] = useState(null); // Add error state
const { searchQuery } = useSearch();

  // In MainHome.jsx
const [lastUpdate, setLastUpdate] = useState(Date.now());

useEffect(() => {
  const loadSlides = async () => {
    try {
      setIsLoading(true);
      const slidesData = await getHeroSlides();
      setSlides(slidesData.filter(slide => slide.isActive));
    } catch (error) {
      console.error("Failed to load hero slides:", error);
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  };

  loadSlides();
}, [lastUpdate]); // Add lastUpdate as dependency

// When slides update in AdminHeroEditor, you can:
// 1. Use a state management solution (Redux, Context)
// 2. Or trigger a refresh by updating lastUpdate
  // Sample categories data
  const categories = [
  { 
    name: "Men's Fashion", 
    count: 42, 
    image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    path: "/category/male" // Changed to match Navbar
  },
  { 
    name: "Women's Fashion", 
    count: 36, 
    image: "https://images.unsplash.com/photo-1596451984027-a127248221e1?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    path: "/category/female", // Changed to match Navbar
  },
  { 
    name: "Electronics", 
    count: 18, 
    image: "https://images.unsplash.com/photo-1524289286702-f07229da36f5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    path: "/category/phones" // Changed to match Navbar
  },
  { 
    name: "Home & Garden", 
    count: 22, 
    image: "https://images.unsplash.com/photo-1573201106611-1de49dfada5d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    path: "/category/furniture" // Changed to match Navbar
  }
];

// Add this near the top of your component, before the return statement
const filteredProducts = products.filter((product) => {
  const query = searchQuery?.trim().toLowerCase();
  if (!query) return false;
  
  return (
    product.name?.toLowerCase().includes(query) ||
    product.category?.toLowerCase().includes(query) ||
    product.description?.toLowerCase().includes(query)
  );
});
  // Load slides from backend API
  useEffect(() => {
    const loadSlides = async () => {
      try {
        const slidesData = await getHeroSlides();
        setSlides(slidesData.filter(slide => slide.isActive));
      } catch (error) {
        console.error("Failed to load hero slides:", error);
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSlides();
  }, []);

  // Animation controls for slide transitions
  useEffect(() => {
    controls.start("visible");
  }, [activeSlide, controls]);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    arrows: false,
    fade: true,
    beforeChange: (_, next) => {
      controls.start("hidden").then(() => {
        setActiveSlide(next);
      });
    },
    appendDots: dots => (
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <ul className="flex space-x-3">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <motion.button
        className={`w-3 h-3 rounded-full relative overflow-hidden ${i === activeSlide ? 'bg-white' : 'bg-white/30'}`}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
      >
        {i === activeSlide && (
          <motion.span
            className="absolute top-0 left-0 h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5.9, ease: 'linear' }}
          />
        )}
      </motion.button>
    )
  };

  const handleRemoveFromFeatured = async (productId) => {
    try {
      await toggleFeatured(productId);
      console.log('Product removed from featured');
    } catch (error) {
      console.error('Failed to remove from featured:', error);
    }
  };

  const getTextColor = (color) => {
    switch (color) {
      case 'black': return 'text-gray-900';
      case 'primary': return 'text-blue-500';
      default: return 'text-white';
    }
  };

  const getTextAlignment = (position) => {
    switch (position) {
      case 'left': return 'items-start text-left pl-8 md:pl-16';
      case 'right': return 'items-end text-right pr-8 md:pl-16';
      default: return 'items-center text-center';
    }
  };

  const getButtonStyle = (style) => {
    switch (style) {
      case 'rounded-full': return 'rounded-full';
      case 'rounded-lg': return 'rounded-lg';
      default: return 'rounded-none';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {searchQuery ? (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">
          Search results for "<span className="font-bold">{searchQuery}</span>"
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-lg">
              No products found.
            </p>
          )}
        </div>
      </div>
    ) : (
      <> 
      {/* Hero Slider Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        {slides.length > 0 ? (
          <Slider {...settings} className="h-full">
            {slides.map((slide, index) => (
              <div key={slide._id || index} className="relative h-[70vh] min-h-[500px] w-full">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundColor: slide.overlayColor,
                      opacity: slide.overlayOpacity / 100
                    }}
                  ></div>
                </div>

                {/* Content */}
                <div className={`container mx-auto px-4 h-full flex items-end pb-16 relative z-10 ${getTextAlignment(slide.textPosition)}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`max-w-2xl ${getTextColor(slide.textColor)}`}
                  >
                    {slide.title && (
                      <motion.h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                      >
                        {slide.title}
                      </motion.h1>
                    )}
                    
                    {slide.subtitle && (
                      <motion.p
                        className="text-xl md:text-2xl mb-6 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                      >
                        {slide.subtitle}
                      </motion.p>
                    )}
                    
                    {slide.ctaText && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      >
                        <Link
                          to={slide.ctaLink || "/shop"}
                          className={`inline-flex items-center px-8 py-3.5 bg-white text-gray-900 font-medium hover:bg-gray-100 transition-all duration-300 group ${getButtonStyle(slide.buttonStyle)}`}
                        >
                          <span>{slide.ctaText}</span>
                          <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <h2 className="text-3xl font-bold mb-4">No Slides Configured</h2>
              <p className="mb-6">Please add slides in the admin panel</p>
              {isAdmin && (
                <Link
                  to="/admin/hero"
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiEdit3 className="mr-2" />
                  Configure Hero Section
                </Link>
              )}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 bg-white/90 text-gray-800 rounded-full shadow-lg hover:bg-white transition-colors"
              title="Edit Hero Section"
            >
              <FiEdit3 size={20} />
            </button>
          </div>
        )}
      </section>
{/* Premium Features Section - Responsive */}
<section className="py-16 bg-gradient-to-b from-white to-gray-50">
  <div className="container mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {/* Feature 1 - Shipping */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xs hover:shadow-sm transition-all duration-300 border border-gray-100">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-full w-max mx-auto mb-3 sm:mb-4">
          <FiTruck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium sm:font-semibold text-center text-gray-800 mb-1 sm:mb-2">
          Free Shipping
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm text-center">
          On all orders over $50
        </p>
        <div className="mt-3 sm:mt-4 text-center">
          <span className="inline-block h-1 w-6 sm:w-8 bg-blue-400 rounded-full"></span>
        </div>
      </div>

      {/* Feature 2 - Security */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xs hover:shadow-sm transition-all duration-300 border border-gray-100">
        <div className="bg-green-50 p-3 sm:p-4 rounded-full w-max mx-auto mb-3 sm:mb-4">
          <FiShield className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium sm:font-semibold text-center text-gray-800 mb-1 sm:mb-2">
          Secure Payment
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm text-center">
          256-bit encryption
        </p>
        <div className="mt-3 sm:mt-4 text-center">
          <span className="inline-block h-1 w-6 sm:w-8 bg-green-400 rounded-full"></span>
        </div>
      </div>

      {/* Feature 3 - Returns */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xs hover:shadow-sm transition-all duration-300 border border-gray-100">
        <div className="bg-purple-50 p-3 sm:p-4 rounded-full w-max mx-auto mb-3 sm:mb-4">
          <FiCreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium sm:font-semibold text-center text-gray-800 mb-1 sm:mb-2">
          Easy Returns
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm text-center">
          30-day guarantee
        </p>
        <div className="mt-3 sm:mt-4 text-center">
          <span className="inline-block h-1 w-6 sm:w-8 bg-purple-400 rounded-full"></span>
        </div>
      </div>

      {/* Feature 4 - Support */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xs hover:shadow-sm transition-all duration-300 border border-gray-100">
        <div className="bg-amber-50 p-3 sm:p-4 rounded-full w-max mx-auto mb-3 sm:mb-4">
          <FiHeadphones className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium sm:font-semibold text-center text-gray-800 mb-1 sm:mb-2">
          24/7 Support
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm text-center">
          Dedicated service
        </p>
        <div className="mt-3 sm:mt-4 text-center">
          <span className="inline-block h-1 w-6 sm:w-8 bg-amber-400 rounded-full"></span>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Featured Products Gallery */}
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4 sm:px-6">
    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
      <div>
        <h2 className="text-3xl font-light text-gray-800 mb-2">Curated Selection</h2>
        <p className="text-gray-500">Our premium featured collection</p>
      </div>
      <Link 
        to="/shop" 
        className="mt-4 md:mt-0 flex items-center text-blue-500 hover:text-blue-700 transition-colors group"
      >
        <span className="font-medium mr-2">Explore All</span>
        <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>

    {productsLoading ? (
      <div className="flex justify-center py-20">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full h-12 w-12 bg-gray-200"></div>
        </div>
      </div>
    ) : featuredProducts.length > 0 ? (
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 4, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="pb-10"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <div className="group relative h-full">
                <ProductCard 
                  product={product}
                  showFeaturedBadge={true}
                  cardStyle="premium"
                />
                {isAdmin && (
                  <button 
                    onClick={() => handleRemoveFromFeatured(product._id)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-500 px-3 py-1.5 text-xs rounded-full shadow-sm hover:bg-red-50 transition-all"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors hidden md:flex items-center justify-center">
          <FiChevronLeft className="text-gray-700 w-5 h-5" />
        </button>
        <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors hidden md:flex items-center justify-center">
          <FiChevronRight className="text-gray-700 w-5 h-5" />
        </button>
      </div>
    ) : (
      <div className="text-center py-20">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FiPackage className="text-gray-400 w-10 h-10" />
        </div>
        <p className="text-gray-500 text-lg mb-6">
          {products.length > 0 
            ? "No featured products selected yet" 
            : "Our collection is currently being curated"}
        </p>
        {isAdmin && (
          <Link
            to="/admin/products"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm"
          >
            <FiPlus className="mr-2" />
            Add Featured Products
          </Link>
        )}
      </div>
    )}
  </div>
</section>
{/* Luxury Categories Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-light text-gray-800 mb-3">Discover by Category</h2>
      <div className="w-20 h-0.5 bg-blue-400 mx-auto"></div>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <motion.div 
          key={index}
          whileHover={{ y: -8 }}
          className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Link to={category.link || category.path || "#"} className="block h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <h3 className="text-xl font-medium text-white mb-1">{category.name}</h3>
              <p className="text-white/80 text-sm">{category.count} items</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center text-white/90 text-sm">
                  Explore collection <FiArrowRight className="ml-2" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
</section>
{/* Premium Dark Accent Call to Action */}
<section className="py-28 bg-gradient-to-br from-gray-900 to-[#4c4c4c] text-white">
  <div className="container mx-auto px-6 text-center">
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 inline-flex items-center justify-center bg-[#4c4c4c]/20 p-4 rounded-full border border-[#4c4c4c]/30">
        <FiAward className="w-10 h-10 text-white/90" />
      </div>
      <h2 className="text-4xl font-light mb-6 leading-tight tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Elevate Your Lifestyle
        </span>
        <br />
        <span className="text-[#4c4c4c]/90">With Our Curated Collection</span>
      </h2>
      <p className="text-xl font-light text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
        Discover exceptional craftsmanship and personalized service designed for the discerning clientele.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <Link 
          to="/shop" 
          className="group relative overflow-hidden bg-[#4c4c4c] hover:bg-[#3a3a3a] px-12 py-4 rounded-full font-medium text-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          <span className="relative z-10 flex items-center">
            <FiShoppingBag className="mr-3 transition-transform duration-300 group-hover:scale-110" />
            Begin Shopping
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#4c4c4c] to-[#2e2e2e] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
        </Link>
        <Link 
          to="/about" 
          className="group relative overflow-hidden bg-transparent border-2 border-[#4c4c4c]/60 hover:border-[#4c4c4c]/90 px-12 py-4 rounded-full font-medium text-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg"
        >
          <span className="relative z-10 flex items-center text-gray-200 group-hover:text-white">
            <FiInfo className="mr-3 transition-transform duration-300 group-hover:scale-110" />
            Our Philosophy
          </span>
          <span className="absolute inset-0 bg-[#4c4c4c]/10 group-hover:bg-[#4c4c4c]/20 transition-all duration-500"></span>
        </Link>
      </div>
    </div>
  </div>
</section>
</>
)}
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Edit Hero Section</h3>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  To edit the hero slider, please use the dedicated admin panel.
                </p>
                
                <div className="flex justify-end pt-4">
                  <Link
                    to="/admin/edit-home"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Go to Hero Section Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainHome;