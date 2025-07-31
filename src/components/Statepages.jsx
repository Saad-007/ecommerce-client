import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiChevronDown, FiHelpCircle, FiTruck, FiPackage, FiGlobe, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ContactUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 bg-[#f8f8f8]">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#4c4c4c]/5 blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-[#4c4c4c]/5 blur-xl"></div>
      </div>

      <div className="text-center mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block px-6 py-2 bg-white rounded-full shadow-sm mb-6 border border-[#4c4c4c]/10"
        >
          <p className="text-sm text-[#4c4c4c]/80 tracking-widest">GET IN TOUCH</p>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-light text-[#4c4c4c] mb-4 leading-tight"
        >
          Contact <span className="font-medium">Our Team</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#4c4c4c]/70 max-w-2xl mx-auto"
        >
          We're here to help and answer any questions you might have. We look forward to hearing from you.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Contact Information */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-8 border border-[#4c4c4c]/10 hover:shadow-md transition-all"
        >
          <h2 className="text-xl font-semibold text-[#4c4c4c] mb-6 pb-4 border-b border-[#4c4c4c]/10">Contact Details</h2>
          
          <div className="space-y-6">
            {[
              {
                icon: <FiMail className="text-[#4c4c4c]" size={20} />,
                title: "Email Us",
                detail: "support@shopplus.com",
                extra: "Send us a message directly",
                bg: "bg-[#4c4c4c]/5"
              },
              {
                icon: <FiPhone className="text-[#4c4c4c]" size={20} />,
                title: "Call Us",
                detail: "+1 (555) 123-4567",
                extra: "Mon-Fri: 8am-6pm EST",
                bg: "bg-[#4c4c4c]/5"
              },
              {
                icon: <FiMapPin className="text-[#4c4c4c]" size={20} />,
                title: "Visit Us",
                detail: "123 Store Street",
                extra: "Cityville, ST 12345",
                bg: "bg-[#4c4c4c]/5"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className={`${item.bg} p-3 rounded-full group-hover:bg-[#4c4c4c]/10 transition-colors`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-medium text-[#4c4c4c]">{item.title}</h3>
                  <p className="text-[#4c4c4c]/70">{item.detail}</p>
                  <p className="text-[#4c4c4c]/60 text-sm mt-1 hover:underline cursor-pointer transition-colors">
                    {item.extra}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-8 border border-[#4c4c4c]/10 hover:shadow-md transition-all"
        >
          <h2 className="text-xl font-semibold text-[#4c4c4c] mb-6 pb-4 border-b border-[#4c4c4c]/10">Send Us a Message</h2>
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#4c4c4c]/80 mb-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-[#4c4c4c]/20 rounded-lg focus:ring-2 focus:ring-[#4c4c4c]/50 focus:border-[#4c4c4c]/50 transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4c4c4c]/80 mb-1">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-[#4c4c4c]/20 rounded-lg focus:ring-2 focus:ring-[#4c4c4c]/50 focus:border-[#4c4c4c]/50 transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#4c4c4c]/80 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-[#4c4c4c]/20 rounded-lg focus:ring-2 focus:ring-[#4c4c4c]/50 focus:border-[#4c4c4c]/50 transition-all"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#4c4c4c]/80 mb-1">Subject</label>
              <select className="w-full px-4 py-3 border border-[#4c4c4c]/20 rounded-lg focus:ring-2 focus:ring-[#4c4c4c]/50 focus:border-[#4c4c4c]/50 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0YzRjNGMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDEwIDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem]">
                <option>Select a topic</option>
                <option>Order Inquiry</option>
                <option>Product Question</option>
                <option>Returns & Exchanges</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#4c4c4c]/80 mb-1">Message</label>
              <textarea 
                rows="4" 
                className="w-full px-4 py-3 border border-[#4c4c4c]/20 rounded-lg focus:ring-2 focus:ring-[#4c4c4c]/50 focus:border-[#4c4c4c]/50 transition-all"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full bg-[#4c4c4c] text-white py-3.5 px-6 rounded-lg hover:bg-[#3a3a3a] transition flex items-center justify-center gap-2"
            >
              <FiSend size={18} />
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unused, in original packaging with tags attached. Some exclusions apply for final sale items."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping delivers within 1-2 business days. Delivery times may vary during peak seasons."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently we ship to over 50 countries worldwide. International orders typically take 7-14 business days and may be subject to customs fees."
    },
    {
      question: "How can I track my order?",
      answer: "You'll receive a tracking number via email once your order ships. You can track your package directly through our website or the carrier's tracking system."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 bg-[#f8f8f8]">
      <div className="text-center mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center bg-[#4c4c4c]/5 p-3 rounded-full mb-6"
        >
          <FiHelpCircle className="text-[#4c4c4c]" size={24} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-light text-[#4c4c4c] mb-4 leading-tight"
        >
          Frequently Asked <span className="font-medium">Questions</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#4c4c4c]/70 max-w-2xl mx-auto"
        >
          Can't find what you're looking for? <span className="text-[#4c4c4c] font-medium cursor-pointer hover:underline">Contact our support team</span>.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4 max-w-3xl mx-auto relative z-10"
      >
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -2 }}
            className="border border-[#4c4c4c]/10 rounded-xl overflow-hidden bg-white hover:shadow-sm transition-all"
          >
            <button className="w-full flex justify-between items-center p-6 text-left hover:bg-[#4c4c4c]/5 transition">
              <h2 className="font-medium text-[#4c4c4c]">{faq.question}</h2>
              <FiChevronDown className="text-[#4c4c4c]/50" />
            </button>
            <div className="px-6 pb-6 pt-0 text-[#4c4c4c]/70">
              {faq.answer}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16 bg-[#4c4c4c]/5 rounded-xl p-8 text-center max-w-3xl mx-auto relative z-10"
      >
        <h3 className="text-xl font-medium text-[#4c4c4c] mb-3">Still have questions?</h3>
        <p className="text-[#4c4c4c]/70 mb-5">Our customer support team is available 24/7 to assist you.</p>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#4c4c4c] text-white py-2.5 px-6 rounded-lg hover:bg-[#3a3a3a] transition inline-flex items-center gap-2"
        >
          Contact Support
        </motion.button>
      </motion.div>
    </div>
  );
};

const Shipping = () => {
  const shippingOptions = [
    {
      icon: <FiTruck className="text-[#4c4c4c]" size={20} />,
      name: "Standard Shipping",
      price: "$4.99",
      time: "3-5 business days",
      free: "Free on orders over $50",
      bg: "bg-[#4c4c4c]/5"
    },
    {
      icon: <FiClock className="text-[#4c4c4c]" size={20} />,
      name: "Express Shipping",
      price: "$9.99",
      time: "1-2 business days",
      free: "Delivered by end of next day",
      bg: "bg-[#4c4c4c]/5"
    },
    {
      icon: <FiPackage className="text-[#4c4c4c]" size={20} />,
      name: "Store Pickup",
      price: "Free",
      time: "Same day",
      free: "Available at select locations",
      bg: "bg-[#4c4c4c]/5"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 bg-[#f8f8f8]">
      <div className="text-center mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block px-6 py-2 bg-white rounded-full shadow-sm mb-6 border border-[#4c4c4c]/10"
        >
          <p className="text-sm text-[#4c4c4c]/80 tracking-widest">DELIVERY OPTIONS</p>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-light text-[#4c4c4c] mb-4 leading-tight"
        >
          Shipping <span className="font-medium">Information</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#4c4c4c]/70 max-w-2xl mx-auto"
        >
          Fast, reliable delivery options to get your order to you as quickly as possible.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10"
      >
        {shippingOptions.map((option, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -8 }}
            className="border border-[#4c4c4c]/10 rounded-xl p-8 bg-white hover:shadow-sm transition-all"
          >
            <div className={`${option.bg} w-14 h-14 rounded-full flex items-center justify-center mb-6`}>
              {option.icon}
            </div>
            <h3 className="font-semibold text-[#4c4c4c] mb-2">{option.name}</h3>
            <p className="text-2xl font-medium text-[#4c4c4c] mb-3">{option.price}</p>
            <div className="flex items-center gap-2 text-[#4c4c4c]/60 text-sm mb-4">
              <FiClock size={14} />
              <span>{option.time}</span>
            </div>
            <p className="text-sm text-[#4c4c4c]/60">{option.free}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8 max-w-4xl mx-auto relative z-10"
      >
        <div className="bg-[#4c4c4c]/5 rounded-xl p-8 border border-[#4c4c4c]/10">
          <h2 className="text-xl font-semibold text-[#4c4c4c] mb-4 flex items-center gap-3">
            <FiGlobe className="text-[#4c4c4c]" />
            International Shipping
          </h2>
          <p className="text-[#4c4c4c]/70 mb-4">
            We ship to most countries worldwide. Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex items-start gap-4">
              <FiCheckCircle className="text-[#4c4c4c] mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-[#4c4c4c]">Delivery Times</h4>
                <p className="text-[#4c4c4c]/60 text-sm">7-14 business days depending on destination</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiCheckCircle className="text-[#4c4c4c] mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-[#4c4c4c]">Tracking</h4>
                <p className="text-[#4c4c4c]/60 text-sm">Full tracking provided for all international orders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-[#4c4c4c]/10">
          <h2 className="text-xl font-semibold text-[#4c4c4c] mb-4">Order Processing</h2>
          <p className="text-[#4c4c4c]/70 mb-6">
            Most orders are processed and shipped within 1-2 business days. You'll receive a confirmation email with tracking information once your order ships.
          </p>
          <div className="bg-[#4c4c4c]/5 rounded-lg p-4 border border-[#4c4c4c]/10">
            <h3 className="font-medium text-[#4c4c4c] mb-2">Need faster delivery?</h3>
            <p className="text-[#4c4c4c]/60 text-sm">
              For urgent orders, please contact our customer service team before placing your order to discuss expedited shipping options.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export { ContactUs, FAQ, Shipping };