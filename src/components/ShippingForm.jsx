// components/ShippingForm.jsx
import React from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function ShippingForm({ address, setAddress, onSubmit }) {
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : "Please enter a valid email";
      case 'zip':
        return value.length >= 5 ? null : "ZIP code must be 5 digits";
      default:
        return value ? null : "This field is required";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    let isValid = true;
    const newErrors = {};
    const requiredFields = ['name', 'email', 'street', 'city', 'zip'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, address[field] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(address).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    if (isValid && onSubmit) {
      onSubmit();
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6 max-w-2xl mx-auto">
      <div className="border-b border-[#4c4c4c]/10 pb-6">
        <h3 className="text-2xl font-light text-[#4c4c4c]">
          Shipping <span className="font-medium">Details</span>
        </h3>
        <p className="text-sm text-[#4c4c4c]/70 mt-1">
          Please enter your information to complete your order
        </p>
      </div>

      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#4c4c4c]/90 mb-1">
            Full Name <span className="text-[#4c4c4c]/50">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={address.name || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Smith"
              required
              className={`mt-1 block w-full rounded-lg border ${errors.name && touched.name ? 'border-red-300' : 'border-[#4c4c4c]/20'} focus:border-[#4c4c4c]/40 focus:ring-1 focus:ring-[#4c4c4c]/20 p-3 transition-all duration-200`}
            />
            {touched.name && !errors.name && (
              <FiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            )}
          </div>
          {errors.name && touched.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#4c4c4c]/90 mb-1">
            Email Address <span className="text-[#4c4c4c]/50">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={address.email || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="john@example.com"
              required
              className={`mt-1 block w-full rounded-lg border ${errors.email && touched.email ? 'border-red-300' : 'border-[#4c4c4c]/20'} focus:border-[#4c4c4c]/40 focus:ring-1 focus:ring-[#4c4c4c]/20 p-3 transition-all duration-200`}
            />
            {touched.email && !errors.email && (
              <FiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            )}
          </div>
          {errors.email && touched.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.email}
            </p>
          )}
        </div>

        {/* Street Address Field */}
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-[#4c4c4c]/90 mb-1">
            Street Address <span className="text-[#4c4c4c]/50">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="street"
              name="street"
              value={address.street || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="123 Main St"
              required
              className={`mt-1 block w-full rounded-lg border ${errors.street && touched.street ? 'border-red-300' : 'border-[#4c4c4c]/20'} focus:border-[#4c4c4c]/40 focus:ring-1 focus:ring-[#4c4c4c]/20 p-3 transition-all duration-200`}
            />
            {touched.street && !errors.street && (
              <FiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            )}
          </div>
          {errors.street && touched.street && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.street}
            </p>
          )}
        </div>

        {/* City/ZIP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-[#4c4c4c]/90 mb-1">
              City <span className="text-[#4c4c4c]/50">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="city"
                name="city"
                value={address.city || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="New York"
                required
                className={`mt-1 block w-full rounded-lg border ${errors.city && touched.city ? 'border-red-300' : 'border-[#4c4c4c]/20'} focus:border-[#4c4c4c]/40 focus:ring-1 focus:ring-[#4c4c4c]/20 p-3 transition-all duration-200`}
              />
              {touched.city && !errors.city && (
                <FiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              )}
            </div>
            {errors.city && touched.city && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" /> {errors.city}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-[#4c4c4c]/90 mb-1">
              ZIP Code <span className="text-[#4c4c4c]/50">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="zip"
                name="zip"
                value={address.zip || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="10001"
                required
                className={`mt-1 block w-full rounded-lg border ${errors.zip && touched.zip ? 'border-red-300' : 'border-[#4c4c4c]/20'} focus:border-[#4c4c4c]/40 focus:ring-1 focus:ring-[#4c4c4c]/20 p-3 transition-all duration-200`}
              />
              {touched.zip && !errors.zip && (
                <FiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              )}
            </div>
            {errors.zip && touched.zip && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" /> {errors.zip}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-[#4c4c4c] hover:bg-[#3a3a3a] text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c4c4c]/50 transition-all duration-200 flex items-center justify-center ${isSubmitting ? 'opacity-80' : ''}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </form>
  );
}