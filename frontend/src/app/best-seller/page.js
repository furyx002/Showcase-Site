'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BestSellerPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Mock best sellers (take first 8 available products)
  const bestSellers = products.filter(p => p.isAvailable).slice(0, 8);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-yellow-200">
      
      {/* Page Header */}
      <div className="bg-[#0a0f1d] py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000" 
            alt="Dark Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-[800px] mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase mb-4">Best Sellers</h1>
          <p className="text-gray-300 text-lg font-light">Our most loved and highly rated premium sanitary products.</p>
        </div>
      </div>

      <section className="max-w-[1600px] mx-auto px-4 lg:px-8 py-16">
        {error ? (
          <div className="text-center text-red-500 font-bold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map(product => {
              const fakeOriginalPrice = Math.round(product.price * 1.3);
              return (
                <Link href={`/product/${product._id}`} key={product._id} className="group flex flex-col relative block cursor-pointer">
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">Top Rated</span>
                  </div>

                  {/* Image */}
                  <div className="aspect-[4/5] bg-gray-50 relative mb-4 overflow-hidden flex items-center justify-center border border-gray-100 group/img">
                    {/* Primary Image */}
                    <img 
                      src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400")} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover/img:opacity-0 group-hover/img:scale-110" 
                    />
                    {/* Secondary Hover Image */}
                    <img 
                      src={(product.images && product.images.length > 1) ? product.images[1] : (product.image ? product.image.replace('.png', '_alt.png') : "https://images.unsplash.com/photo-1585058178306-03c00cb571d8?auto=format&fit=crop&q=80&w=400")} 
                      alt={`${product.name} alternate view`} 
                      className="absolute inset-0 w-full h-full object-cover opacity-0 scale-95 transition-all duration-700 ease-in-out group-hover/img:opacity-100 group-hover/img:scale-105" 
                    />
                  </div>

                  {/* Content */}
                  <div className="text-center flex-1 flex flex-col">
                    <div className="block mt-4 flex-1">
                      <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide mb-1 hover:text-yellow-600 transition-colors">{product.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">COMPLETE SET | PREMIUM QUALITY</p>
                      


                      {/* Pricing */}
                      <div className="flex items-center justify-center gap-2 mt-auto">
                        <span className="text-[#ff4d4f] font-bold">Rs.{product.price.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs line-through">Rs.{fakeOriginalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
