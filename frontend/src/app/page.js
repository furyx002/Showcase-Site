'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '../lib/useSettings';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { settings } = useSettings();

  const whatsappNumber = settings?.whatsappNumber || '+923401013889';
  const activeSliders = (settings?.heroSliders || []).filter(url => url && url.trim() !== '');
  const heroSliders = activeSliders.length > 0 ? activeSliders : ['/slider1.jpg', '/slider2.jpg'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSliders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSliders.length]);

  const loadProducts = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    return matchesSearch && matchesCategory && product.isAvailable;
  });

  const handleOrder = (product) => {
    const message = `Hello! I would like to order: *${product.name}* for *Rs. ${product.price.toLocaleString()}*.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-yellow-200">
      {/* Header moved to layout.js */}

      {/* Hero Image Slider */}
      <section className="relative w-full bg-black overflow-hidden group">
        <div 
          className="flex w-full items-center transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSliders.map((imgUrl, idx) => (
            <img 
              key={idx}
              src={imgUrl} 
              alt={`Slider ${idx + 1}`} 
              className="w-full h-auto object-contain flex-shrink-0"
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentSlide(prev => (prev === 0 ? heroSliders.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button 
          onClick={() => setCurrentSlide(prev => (prev === heroSliders.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {heroSliders.map((_, idx) => (
            <div 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                currentSlide === idx ? 'bg-yellow-500 w-8' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Masonry Category Grid */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[600px]">
          
          {/* Left Large Column */}
          {categories.length > 0 && (
            <div className="relative group overflow-hidden bg-black h-[400px] lg:h-full">
              <img src={categories[0].image || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000"} alt={categories[0].title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <span className="text-gray-400 text-sm tracking-widest font-semibold uppercase mb-1">Sanitary</span>
                <h3 className="text-4xl md:text-5xl font-black text-white leading-none mb-6 whitespace-pre-line">{categories[0].title}</h3>
                <Link href={`/shop-all?category=${encodeURIComponent(categories[0].title.replace(/\n/g, ' '))}`} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 px-6 w-max flex items-center gap-2 transition-colors">
                  SHOP NOW <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Right Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-4 sm:grid-rows-2 gap-4 h-[1000px] sm:h-[600px] lg:h-full">
            {categories.slice(1, 5).map((cat, i) => (
              <div key={i} className="relative group overflow-hidden bg-black w-full h-full">
                <img src={cat.image || "/demo_shower.png"} alt={cat.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6 z-10">
                  <span className="text-gray-400 text-xs tracking-widest font-semibold uppercase mb-1">Sanitary</span>
                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-4 whitespace-pre-line">{cat.title}</h3>
                  <Link href={`/shop-all?category=${encodeURIComponent(cat.title.replace(/\n/g, ' '))}`} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1.5 px-4 text-xs w-max flex items-center gap-1 transition-colors relative z-20">
                    SHOP NOW <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-8 py-16">
        
        {/* Section Header */}
        <div className="flex items-center justify-center mb-10 w-full overflow-hidden">
          <div className="h-px bg-gray-300 flex-1"></div>
          <h2 className="text-lg md:text-2xl font-black tracking-widest uppercase px-4 md:px-8 text-gray-900 text-center shrink-0">COMPLETE SHOWER SETS</h2>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <div className="text-center mb-12">
          <Link href="/shop-all" className="text-sm font-semibold text-gray-500 border-b border-gray-500 pb-0.5 hover:text-black transition-colors">View All</Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.slice(0, 4).map(product => {
            const originalPrice = product.originalPrice || product.price;
            return (
              <Link href={`/product/${product._id}`} key={product._id} className="group flex flex-col relative block cursor-pointer">
                
                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  {product.badges && product.badges.map((badge, idx) => (
                    <span key={idx} className="bg-[#ff4d4f] text-white text-[10px] font-bold px-2 py-0.5">{badge}</span>
                  ))}
                </div>

                  {/* Image */}
                  <div className="aspect-[4/5] bg-gray-50 relative mb-4 overflow-hidden flex items-center justify-center border border-gray-100 group/img">
                    {/* Primary Image */}
                    <img 
                      src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400")} 
                      alt={product.name} 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${product.images && product.images.length > 1 ? 'lg:group-hover/img:opacity-0 lg:group-hover/img:scale-110' : 'hover:scale-105'}`} 
                    />
                    {/* Secondary Hover Image (Only if exists) */}
                    {product.images && product.images.length > 1 && (
                      <img 
                        src={product.images[1]} 
                        alt={`${product.name} alternate view`} 
                        className="absolute inset-0 w-full h-full object-cover opacity-0 scale-95 transition-all duration-700 ease-in-out lg:group-hover/img:opacity-100 lg:group-hover/img:scale-105" 
                      />
                    )}
                  </div>

                {/* Content */}
                <div className="text-center flex-1 flex flex-col">
                  <div className="block mt-4 flex-1">
                    <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide mb-1 hover:text-blue-600 transition-colors">{product.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">COMPLETE SET | PREMIUM QUALITY</p>
                    


                    {/* Pricing */}
                    <div className="flex items-center justify-center gap-2 mt-auto">
                      <span className="text-[#ff4d4f] font-bold">Rs.{product.price.toLocaleString()}</span>
                      {originalPrice > product.price && (
                        <span className="text-gray-400 text-xs line-through">Rs.{originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleOrder(product);
                    }}
                    className="mt-4 w-full bg-black hover:bg-gray-800 text-white font-bold py-2.5 text-xs transition-colors relative z-20"
                  >
                    BUY ON WHATSAPP
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-3xl font-medium text-gray-900 mb-12 relative inline-block">
            Why Pakistan Trusts Us?
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center w-24">
              <div className="h-px bg-yellow-500 flex-1"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mx-1"></div>
              <div className="h-px bg-yellow-500 flex-1"></div>
            </div>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200">
            <div className="flex flex-col items-center text-center px-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-yellow-500 mb-1 sm:mb-2">100%</h3>
              <p className="text-[8px] sm:text-[10px] font-bold text-black tracking-widest uppercase">ORIGINAL PRODUCT</p>
            </div>
            <div className="flex flex-col items-center text-center px-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-yellow-500 mb-1 sm:mb-2">PREMIUM</h3>
              <p className="text-[8px] sm:text-[10px] font-bold text-black tracking-widest uppercase"><span className="text-gray-500 block sm:inline">AUTHENTIC</span> 304 Grade Steel</p>
            </div>
            <div className="flex flex-col items-center text-center px-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-yellow-500 mb-1 sm:mb-2">GUARANTEED</h3>
              <p className="text-[8px] sm:text-[10px] font-bold text-black tracking-widest uppercase"><span className="text-gray-500 block sm:inline">RUST-FREE</span> QUALITY</p>
            </div>
            <div className="flex flex-col items-center text-center px-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-yellow-500 mb-1 sm:mb-2">NATIONWIDE</h3>
              <p className="text-[8px] sm:text-[10px] font-bold text-black tracking-widest uppercase"><span className="text-gray-500 block sm:inline">SECURE</span> DELIVERY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer moved to layout.js */}

    </div>
  );
}
