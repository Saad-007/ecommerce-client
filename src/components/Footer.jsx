import React from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin
} from "react-icons/fi";
import { BsShieldCheck } from "react-icons/bs";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "New Arrivals", path: "/new" },
        { name: "Most Selling Products", path: "/bestsellers" },
      ],
    },
    {
      title: "Help",
      links: [
        { name: "Contact", path: "/contact" },
        { name: "FAQs", path: "/faqs" },
        { name: "Shipping", path: "/shipping" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 shadow-sm">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link 
              to="/" 
              className="flex items-center group"
            >
              <span className="bg-[#4c4c4c] text-white p-2 rounded-lg mr-3 group-hover:rotate-12 transition-transform duration-300">
                <FiShoppingCart size={20} />
              </span>
              <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                ShopPlus
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Curated collections, fast delivery. Elevate your shopping experience with us.
            </p>
            <div className="flex space-x-4">
              {[FiFacebook, FiTwitter, FiInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={`Social Link ${i + 1}`}
                  className="text-gray-400 hover:text-blue-500 transition-colors hover:-translate-y-1 duration-200"
                >
                  <Icon size={18} className="hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Footer Links */}
          {footerLinks.map((section, i) => (
            <div key={i} className="space-y-4">
              <h4 className="text-gray-800 font-semibold text-sm uppercase tracking-wider border-b border-gray-200 pb-2">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      to={link.path}
                      className="text-gray-500 hover:text-blue-500 text-sm transition-colors flex items-center group"
                    >
                      <span className="w-1 h-1 bg-gray-300 rounded-full mr-2 group-hover:bg-blue-500 transition-colors"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-gray-800 font-semibold text-sm uppercase tracking-wider border-b border-gray-200 pb-2">
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-500 text-sm leading-relaxed">
                  123 Store Street, Cityville
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-blue-500" />
                <p className="text-gray-500 text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-blue-500" />
                <p className="text-gray-500 text-sm hover:text-blue-500 transition-colors">
                  support@shopplus.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
              <BsShieldCheck className="text-blue-500" size={20} />
              <span className="text-gray-600 text-sm font-medium">Secure Payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-white py-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-400 mb-3 md:mb-0">
            © {currentYear} ShopPlus. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link 
              to="/privacy" 
              className="text-gray-500 hover:text-blue-500 transition-colors font-medium"
            >
              Privacy
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-500 hover:text-blue-500 transition-colors font-medium"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;