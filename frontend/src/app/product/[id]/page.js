'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { Star, MessageCircle, ArrowLeft, Heart, Share2, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '../../../lib/useSettings';
import { toast } from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { settings } = useSettings();
  const whatsappNumber = settings?.whatsappNumber || '+923401013889';

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts();
      const foundProduct = (res.data || []).find(p => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.images && foundProduct.images.length > 0) {
          setSelectedImage(foundProduct.images[0]);
        } else if (foundProduct.image) {
          setSelectedImage(foundProduct.image);
        }
      } else {
        setError('Product not found.');
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    if (!product) return;
    const message = `Hello! I would like to order: *${product.name}* for *Rs. ${product.price.toLocaleString()}*.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Product not found'}</h2>
        <Link href="/" className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const originalPrice = product.originalPrice || product.price;
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors">HOME</Link>
          <span>/</span>
          <Link href={`/collections`} className="hover:text-black transition-colors uppercase">{product.category || 'COLLECTION'}</Link>
          <span>/</span>
          <span className="text-black uppercase">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="bg-gray-50 aspect-square rounded-2xl p-8 flex items-center justify-center relative border border-gray-100 overflow-hidden group">
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                {product.badges && product.badges.map((badge, idx) => (
                  <span key={idx} className="bg-[#ff4d4f] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm shadow-md">{badge}</span>
                ))}
              </div>
              <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
                <button 
                  onClick={async () => {
                    try {
                      if (navigator.share) {
                        await navigator.share({ title: product.name, url: window.location.href });
                      } else {
                        await navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied to clipboard!');
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1584622781864-1c195eb48842?auto=format&fit=crop&q=80&w=800" 
                  alt="Placeholder"
                  className="w-full h-full object-contain filter drop-shadow-2xl opacity-80 transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>

            {/* Thumbnail Gallery */}
            {(product.images && product.images.length > 1) && (
              <div className="flex gap-4 overflow-x-auto pb-2 px-1">
                {product.images.map((imgUrl, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === imgUrl ? 'border-yellow-500 scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={imgUrl} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="text-yellow-600 font-bold tracking-widest text-xs uppercase">{product.category || 'Premium Sanitary'}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4 uppercase">{product.name}</h1>
            


            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-black text-[#ff4d4f]">Rs. {product.price.toLocaleString()}</span>
              {originalPrice > product.price && (
                <>
                  <span className="text-xl font-semibold text-gray-400 line-through mb-1">Rs. {originalPrice.toLocaleString()}</span>
                  <span className="bg-[#ff4d4f]/10 text-[#ff4d4f] font-bold text-sm px-2 py-1 rounded-sm mb-1 ml-2">Save {Math.round(((originalPrice - product.price) / originalPrice) * 100)}%</span>
                </>
              )}
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-10 font-light">
              Elevate your bathroom aesthetic with our premium {product.name.toLowerCase()}. Crafted from high-grade materials for unparalleled durability and finished with a flawless, corrosion-resistant coating. This elegant piece perfectly balances modern design with superior functionality.
            </p>

            {/* Features list */}
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <ShieldCheck className="w-5 h-5 text-green-500" /> 10-Year Rust-Free Warranty
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <Truck className="w-5 h-5 text-blue-500" /> Free Shipping Across Pakistan
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <ShieldCheck className="w-5 h-5 text-yellow-500" /> 100% Authentic Grade 304 Stainless Steel
              </li>
            </ul>

            <button 
              onClick={handleOrder}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-lg py-5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mb-6"
            >
              <MessageCircle className="w-7 h-7 fill-current" />
              ORDER ON WHATSAPP
            </button>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              SECURE CHECKOUT & FAST DELIVERY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
