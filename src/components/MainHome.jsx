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
     <section className="relative h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] w-full overflow-hidden">
  {slides.length > 0 ? (
    <Slider {...settings} className="h-full">
      {slides.map((slide, index) => (
        <div key={slide._id || index} className="relative h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] w-full">
          {/* Background Image with Mobile-Optimized Crop */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center md:object-top"
            />
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: slide.overlayColor,
                opacity: slide.overlayOpacity / 100
              }}
            ></div>
          </div>

          {/* Responsive Content */}
          <div className={`container mx-auto px-4 h-full flex items-end pb-8 sm:pb-16 relative z-10 ${getTextAlignment(slide.textPosition)}`}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`max-w-2xl ${getTextColor(slide.textColor)}`}
            >
              {slide.title && (
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {slide.title}
                </motion.h1>
              )}
              
              {slide.subtitle && (
                <motion.p
                  className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 font-medium"
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
                    className={`inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3.5 bg-white text-gray-900 font-medium hover:bg-gray-100 transition-all duration-300 group ${getButtonStyle(slide.buttonStyle)}`}
                  >
                    <span className="text-sm sm:text-base">{slide.ctaText}</span>
                    <FiArrowRight className="ml-1 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1" />
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
      <div className="text-white text-center p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">No Slides Configured</h2>
        <p className="mb-4 sm:mb-6">Please add slides in the admin panel</p>
        {isAdmin && (
          <Link
            to="/admin/hero"
            className="inline-flex items-center px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <FiEdit3 className="mr-1 sm:mr-2" />
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
        className="p-1.5 sm:p-2 bg-white/90 text-gray-800 rounded-full shadow-lg hover:bg-white transition-colors"
        title="Edit Hero Section"
      >
        <FiEdit3 size={18} className="sm:w-5 sm:h-5" />
      </button>
    </div>
  )}
</section>
{/* Ultimate Minimal Premium Features */}
{/* Our Promise - Elevated Design */}
<section className="py-28 bg-[#f8f8f8] relative overflow-hidden">
  {/* Decorative elements */}
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
    <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#4c4c4c]/5 blur-xl"></div>
    <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-[#4c4c4c]/5 blur-xl"></div>
  </div>

  <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
    {/* Animated badge */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-block px-6 py-2.5 bg-white rounded-full shadow-sm mb-8 border border-[#4c4c4c]/10"
    >
      <p className="text-sm text-[#4c4c4c]/80 tracking-widest">OUR COMMITMENT TO YOU</p>
    </motion.div>

    {/* Headline with gradient text */}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-4xl md:text-5xl font-light text-[#4c4c4c] mb-12 leading-tight"
    >
      We Deliver <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#4c4c4c] to-[#7a7a7a]">Exceptional Quality</span> <br className="hidden md:block" /> 
      & <span className="italic">Unparalleled</span> Service
    </motion.h2>
    
    {/* Features grid with animated cards */}
    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          icon: <FiAward className="w-8 h-8" />,
          title: "Curated Excellence",
          desc: "Each product is hand-selected by our experts for quality and design",
          color: "from-[#6a6a6a] to-[#4c4c4c]"
        },
        {
          icon: <FiEdit3 className="w-8 h-8" />,
          title: "Thoughtful Details",
          desc: "From packaging to delivery, every touchpoint is carefully considered",
          color: "from-[#5e5e5e] to-[#4c4c4c]"
        },
        {
          icon: <FiStar className="w-8 h-8" />,
          title: "Lasting Relationships",
          desc: "We're here for you beyond the purchase with ongoing support",
          color: "from-[#525252] to-[#4c4c4c]"
        }
      ].map((item, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          whileHover={{ y: -8 }}
          className="group relative"
        >
          {/* Card background */}
          <div className="absolute inset-0 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-2"></div>
          
          {/* Card content */}
          <div className="relative h-full bg-white rounded-xl p-8 border border-[#4c4c4c]/10 overflow-hidden">
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}></div>
            
            {/* Icon container */}
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#4c4c4c]/5 group-hover:bg-[#4c4c4c]/10 transition-colors duration-300">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white">
                {item.icon}
              </div>
            </div>
            
            {/* Text content */}
            <h3 className="text-xl font-medium text-[#4c4c4c] mb-3">{item.title}</h3>
            <p className="text-[#4c4c4c]/70">{item.desc}</p>
            
            {/* Hover effect indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#4c4c4c]/50 to-transparent"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Subtle CTA at bottom */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mt-16"
    >
      <Link 
        to="/about" 
        className="inline-flex items-center px-8 py-3.5 border border-[#4c4c4c]/20 rounded-full text-[#4c4c4c] hover:bg-[#4c4c4c] hover:text-white transition-all duration-300 group"
      >
        <span>Discover Our Standards</span>
        <FiArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
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
        to="/Home" 
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
{/* Luxury Categories Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-light text-gray-800 mb-3">Discover by Category</h2>
      <div className="w-20 h-0.5 bg-blue-400 mx-auto"></div>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category, index) => {
        // Extract the base category name from the path
        const categoryKey = category.path.replace('/category/', '').toLowerCase();
        
        // Count products in this category
        const productCount = products.filter(product => {
          const productCategory = product.category?.toLowerCase();
          return productCategory && productCategory.includes(categoryKey);
        }).length;

        return (
          <motion.div 
            key={index}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link to={category.path} className="block h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <h3 className="text-xl font-medium text-white mb-1">{category.name}</h3>
                <p className="text-white/80 text-sm">{productCount} items</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center text-white/90 text-sm">
                    Explore collection <FiArrowRight className="ml-2" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
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