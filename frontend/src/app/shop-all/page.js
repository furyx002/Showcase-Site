  'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { api } from '../../lib/api';
import { Star, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ShopAllContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const queryCategory = searchParams.get('category');
    if (queryCategory) {
      setCategoryFilter(queryCategory);
    } else {
      setCategoryFilter('ALL');
    }
  }, [searchParams]);

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    return matchesSearch && matchesCategory && product.isAvailable;
  });

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-yellow-200">
      
      {/* Page Header */}
      <div className="bg-[#f8f9fa] py-16 text-center border-b border-gray-200">
        <div className="max-w-[800px] mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-widest uppercase mb-4">Shop All</h1>
          <p className="text-gray-500 text-lg font-light">Browse our complete collection of premium sanitary products.</p>
        </div>
      </div>

      <section className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors rounded-sm ${
                  categoryFilter === cat 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black text-sm rounded-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {error ? (
          <div className="text-center text-red-500 font-bold">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No products found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => {
              const originalPrice = product.originalPrice || product.price;
              return (
                <Link href={`/product/${product._id}`} key={product._id} className="group flex flex-col relative block cursor-pointer">
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {product.badges && product.badges.map((badge, idx) => (
                      <span key={idx} className="bg-[#ff4d4f] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">{badge}</span>
                    ))}
                  </div>

                  {/* Image */}
                  <div className="aspect-[4/5] bg-gray-50 relative mb-4 overflow-hidden flex items-center justify-center border border-gray-100 group/img">
                    {/* Primary Image */}
                    <img 
                      src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400")} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out lg:group-hover/img:opacity-0 lg:group-hover/img:scale-110" 
                    />
                    {/* Secondary Hover Image */}
                    <img 
                      src={(product.images && product.images.length > 1) ? product.images[1] : (product.image ? product.image.replace('.png', '_alt.png') : "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400")} 
                      alt={`${product.name} alternate view`} 
                      className="absolute inset-0 w-full h-full object-cover opacity-0 scale-95 transition-all duration-700 ease-in-out lg:group-hover/img:opacity-100 lg:group-hover/img:scale-105" 
                    />
                  </div>

                  {/* Content */}
                  <div className="text-center flex-1 flex flex-col">
                    <div className="block mt-4 flex-1">
                      <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide mb-1 hover:text-yellow-600 transition-colors">{product.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">COMPLETE SET | PREMIUM QUALITY</p>
                      
                      {/* Pricing */}
                      <div className="flex items-center justify-center gap-2 mt-auto pt-2">
                        <span className="text-[#ff4d4f] font-bold">Rs.{product.price.toLocaleString()}</span>
                        {originalPrice > product.price && (
                          <span className="text-gray-400 text-xs line-through">Rs.{originalPrice.toLocaleString()}</span>
                        )}
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

export default function ShopAllPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    }>
      <ShopAllContent />
    </Suspense>
  );
}
