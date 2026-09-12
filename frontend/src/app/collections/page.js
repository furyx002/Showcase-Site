'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.getCategories();
        setCollections(res || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-[#0a0f1d] py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000" 
            alt="Dark Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-[800px] mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase mb-4">Our Collections</h1>
          <p className="text-gray-300 text-lg font-light">Explore our curated selection of premium sanitary ware, designed to elevate your living spaces with modern elegance.</p>
        </div>
      </div>

      {/* Masonry Category Grid */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-bold tracking-widest uppercase">Loading collections...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]">
            {collections.map((cat, i) => (
              <div key={cat._id || i} className={`relative group overflow-hidden bg-black ${cat.span || 'col-span-1 row-span-1'}`}>
                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <span className="text-gray-400 text-xs tracking-widest font-semibold uppercase mb-2">Explore</span>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-6 whitespace-pre-line">{cat.title}</h3>
                  <Link href={`/shop-all?category=${encodeURIComponent(cat.title.replace(/\n/g, ' '))}`} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 px-6 text-sm w-max flex items-center gap-2 transition-colors">
                    VIEW COLLECTION <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
