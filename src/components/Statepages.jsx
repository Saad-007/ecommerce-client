import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';

export const ContactUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact Our Team</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          We're here to help and answer any questions you might have. 
          We look forward to hearing from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Details</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <FiMail className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Email Us</h3>
                <p className="text-gray-500">support@shopplus.com</p>
                <p className="text-blue-500 text-sm mt-1 hover:underline cursor-pointer">
                  Send us a message directly
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <FiPhone className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Call Us</h3>
                <p className="text-gray-500">+1 (555) 123-4567</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <FiClock size={14} />
                  <span>Mon-Fri: 8am-6pm EST</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <FiMapPin className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Visit Us</h3>
                <p className="text-gray-500">123 Store Street</p>
                <p className="text-gray-500">Cityville, ST 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Select a topic</option>
                <option>Order Inquiry</option>
                <option>Product Question</option>
                <option>Returns & Exchanges</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                rows="4" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <FiSend size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};





import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

export const FAQ = () => {
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
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-blue-100 p-3 rounded-full mb-4">
          <FiHelpCircle className="text-blue-600" size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Can't find what you're looking for? <span className="text-blue-600 cursor-pointer hover:underline">Contact our support team</span>.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
            <button className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition">
              <h2 className="font-medium text-gray-800">{faq.question}</h2>
              <FiChevronDown className="text-gray-400" />
            </button>
            <div className="px-5 pb-5 pt-0 text-gray-600">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
        <h3 className="text-xl font-medium text-gray-800 mb-3">Still have questions?</h3>
        <p className="text-gray-600 mb-5">Our customer support team is available 24/7 to assist you.</p>
        <button className="bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2">
          Contact Support
        </button>
      </div>
    </div>
  );
};



import { FiTruck,  FiPackage, FiGlobe, FiCheckCircle } from 'react-icons/fi';

export const Shipping = () => {
  const shippingOptions = [
    {
      icon: <FiTruck className="text-blue-600" size={20} />,
      name: "Standard Shipping",
      price: "$4.99",
      time: "3-5 business days",
      free: "Free on orders over $50"
    },
    {
      icon: <FiClock className="text-blue-600" size={20} />,
      name: "Express Shipping",
      price: "$9.99",
      time: "1-2 business days",
      free: "Delivered by end of next day"
    },
    {
      icon: <FiPackage className="text-blue-600" size={20} />,
      name: "Store Pickup",
      price: "Free",
      time: "Same day",
      free: "Available at select locations"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Shipping Information</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Fast, reliable delivery options to get your order to you as quickly as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {shippingOptions.map((option, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              {option.icon}
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{option.name}</h3>
            <p className="text-2xl font-medium text-gray-900 mb-2">{option.price}</p>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
              <FiClock size={14} />
              <span>{option.time}</span>
            </div>
            <p className="text-sm text-gray-500">{option.free}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiGlobe className="text-blue-600" />
            International Shipping
          </h2>
          <p className="text-gray-600 mb-3">
            We ship to most countries worldwide. Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-800">Delivery Times</h4>
                <p className="text-gray-500 text-sm">7-14 business days depending on destination</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-800">Tracking</h4>
                <p className="text-gray-500 text-sm">Full tracking provided for all international orders</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Processing</h2>
          <p className="text-gray-600 mb-4">
            Most orders are processed and shipped within 1-2 business days. You'll receive a confirmation email with tracking information once your order ships.
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Need faster delivery?</h3>
            <p className="text-gray-600 text-sm">
              For urgent orders, please contact our customer service team before placing your order to discuss expedited shipping options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};