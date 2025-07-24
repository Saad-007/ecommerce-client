// src/components/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from './Loader';
import { useState, useEffect } from 'react';

export default function AppLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="app">
      <Navbar />
      <main className="min-h-[calc(100vh-160px)]">
        <Outlet /> {/* This renders the matched child routes */}
      </main>
      <Footer />
    </div>
  );
}