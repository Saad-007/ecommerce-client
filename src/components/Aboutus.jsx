import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiUsers, FiShoppingBag, FiGlobe, FiChevronRight } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import team1 from '../assets/team1.jpg';
import team2 from '../assets/team2.jpg';
import team3 from '../assets/team3.jpg';
import team4 from '../assets/team4.jpg';

const AboutUs = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="bg-white" ref={ref}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-purple-50 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-pink-100 transform rotate-6"></div>
        </div>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <motion.div variants={fadeIn} className="text-center">
            <span className="inline-block px-3 py-1 text-sm font-medium text-[#4c4c4c] bg-[#dfdbdb] rounded-full mb-4">
              About ShopPlus
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
  Crafting Exceptional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4c4c4c] via-[#5a5a5a] to-[#3a3a3a]">
  Shopping Experiences
</span>

</h1>

            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed tracking-wide">
  From humble beginnings to becoming a trusted name in global e-commerce
</p>

          </motion.div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <motion.div 
              initial="hidden"
              animate={controls}
              variants={fadeIn}
              className="mt-12 sm:mt-16 lg:mt-0 order-last lg:order-first"
            >
              <div className="relative h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
                  alt="Our team collaborating in modern office"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/images/team-working-fallback.jpg';
                    e.target.className = 'w-full h-full object-contain bg-gray-100 p-4';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              animate={controls}
              variants={fadeIn}
              className="lg:py-24"
            >
              <span className="text-sm font-semibold tracking-wider text-[#4c4c4c] uppercase">
                Our Purpose
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2">
                Redefining E-Commerce Excellence
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                At ShopPlus, we're committed to revolutionizing your shopping experience through 
                innovative technology, curated quality, and unparalleled customer care. Our mission 
                extends beyond transactions to creating meaningful connections between brands and 
                consumers worldwide.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#4c4c4c] hover:bg-[#373535] transition-all duration-300 hover:shadow-md"
                >
                  Explore Our Products
                </Link>
                <Link
                  to="/story"
                 className="inline-flex items-center justify-center px-6 py-3 border border-transparent 
text-base font-medium rounded-2xl shadow-sm text-white 
bg-gradient-to-r from-[#4c4c4c] to-[#2f2f2f] hover:from-[#373535] hover:to-[#1f1f1f] 
transition-all duration-300 hover:shadow-lg"

                >
                  Our Journey <FiChevronRight className="ml-1.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: <FiAward className="mx-auto h-12 w-12 text-[#4c4c4c]" />,
                value: "10+ Years",
                label: "Industry Leadership",
                description: "Trusted since 2013"
              },
              {
                icon: <FiUsers className="mx-auto h-12 w-12 text-[#4c4c4c]" />,
                value: "500K+",
                label: "Satisfied Customers",
                description: "Global community"
              },
              {
                icon: <FiShoppingBag className="mx-auto h-12 w-12 text-[#4c4c4c]" />,
                value: "10K+",
                label: "Premium Products",
                description: "Carefully curated"
              },
              {
                icon: <FiGlobe className="mx-auto h-12 w-12 text-[#4c4c4c]" />,
                value: "50+",
                label: "Countries Served",
                description: "Worldwide shipping"
              }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
              >
                <div className="flex justify-center">{stat.icon}</div>
                <h3 className="mt-4 text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="mt-2 text-lg font-medium text-gray-900">{stat.label}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate={controls}
            variants={fadeIn}
            className="text-center"
          >
            <span className="text-sm font-semibold tracking-wider text-[#4c4c4c] uppercase">
              Our People
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2">
              Meet The Visionaries
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              The brilliant minds shaping the future of ShopPlus
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                name: 'Alex Johnson',
                role: 'Founder & CEO',
                image: team1,
                bio: 'Serial entrepreneur with 15+ years in e-commerce innovation',
                social: {
                  twitter: '#',
                  linkedin: '#'
                }
              },
              {
                name: 'Sarah Williams',
                role: 'Chief Operations',
                image: team2,
                bio: 'Supply chain expert ensuring seamless customer experiences',
                social: {
                  twitter: '#',
                  linkedin: '#'
                }
              },
              {
                name: 'Michael Chen',
                role: 'CTO',
                image: team3,
                bio: 'Tech visionary building our cutting-edge platform',
                social: {
                  twitter: '#',
                  linkedin: '#'
                }
              },
              {
                name: 'Emma Rodriguez',
                role: 'Customer Success',
                image: team4,
                bio: 'Your dedicated advocate for exceptional service',
                social: {
                  twitter: '#',
                  linkedin: '#'
                }
              }
            ].map((person, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="group pt-6"
              >
                <div className="flow-root bg-gray-50 rounded-xl px-6 pb-8 h-full transition-all duration-300 hover:shadow-lg hover:bg-white">
                  <div className="-mt-6">
                    <div className="flex items-center justify-center h-28 w-28 rounded-xl bg-white shadow-md overflow-hidden mx-auto transition-transform duration-300 group-hover:scale-105">
                      <img
                        className="h-full w-full object-cover"
                        src={person.image}
                        alt={person.name}
                        loading="lazy"
                      />
                    </div>
                    <h3 className="mt-8 text-xl font-bold text-gray-900 text-center">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-base text-[#4c4c4c] font-medium text-center">
                      {person.role}
                    </p>
                    <p className="mt-3 text-base text-gray-600 text-center">
                      {person.bio}
                    </p>
                    <div className="mt-4 flex justify-center space-x-4">
                      <a href={person.social.twitter} className="text-gray-400 hover:text-blue-500">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href={person.social.linkedin} className="text-gray-400 hover:text-blue-700">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <motion.div 
              initial="hidden"
              animate={controls}
              variants={fadeIn}
              className="lg:py-24"
            >
              <span className="text-sm font-semibold tracking-wider text-[#4c4c4c] uppercase">
                Our Foundation
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2">
                Core Values That Drive Us
              </h2>
              <div className="mt-8 space-y-8">
                {[
                  {
                    name: 'Customer Obsession',
                    description: 'We start with the customer and work backwards, anticipating needs before they arise',
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )
                  },
                  {
                    name: 'Relentless Innovation',
                    description: 'Continuous improvement is in our DNA - we never settle for good enough',
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )
                  },
                  {
                    name: 'Integrity First',
                    description: 'We do the right thing, even when no one is watching',
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )
                  },
                  {
                    name: 'Sustainable Growth',
                    description: 'We build for the long term, balancing profit with planetary responsibility',
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )
                  }
                ].map((value, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#4c4c4c] text-white shadow-md">
                        {value.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-gray-900">
                        {value.name}
                      </h4>
                      <p className="mt-1 text-gray-600">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              animate={controls}
              variants={fadeIn}
              className="mt-12 sm:mt-16 lg:mt-0"
            >
              <div className="relative h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
                  alt="Team collaborating in modern workspace"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

            {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#5c5c5c] to-[#3b3b3b]">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div 
            initial="hidden"
            animate={controls}
            variants={fadeIn}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl font-playfair font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to experience the ShopPlus difference?</span>
              <span className="block text-gray-300">Join thousands of satisfied customers.</span>
            </h2>
          </motion.div>
          <motion.div 
            initial="hidden"
            animate={controls}
            variants={fadeIn}
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0 justify-center lg:justify-start"
          >
            <div className="inline-flex rounded-lg shadow">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-[#4c4c4c] bg-white hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
              >
                Browse Products
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-lg shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#4c4c4c] hover:bg-[#2f2f2f] transition-all duration-300 hover:shadow-md"
              >
                Contact Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;