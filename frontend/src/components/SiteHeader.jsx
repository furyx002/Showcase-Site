'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useSettings } from '../lib/useSettings';

export default function SiteHeader() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings } = useSettings();

  // Hide header on admin routes (POS system)
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/manage-x7k9'))) {
    return null;
  }

  const isActive = (path) => pathname === path;

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [sidebarOpen]);

  return (
    <>
      {/* Main Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
        {/* Mobile Header Bar */}
        <div className="lg:hidden max-w-[1600px] mx-auto px-4 py-4 sm:py-5 flex items-center justify-between relative min-h-[72px] sm:min-h-[84px] overflow-hidden">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-800 hover:text-black transition-colors z-10"
            aria-label="Open Menu"
          >
            <Menu className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-0">
            <img 
              src="/logo.png" 
              alt="Power Flow Logo" 
              className="h-12 sm:h-16 w-auto object-contain scale-[2.2] sm:scale-[2.6]" 
            />
          </Link>

          <div className="w-7 h-7 sm:w-8 sm:h-8 z-10"></div>
        </div>

        {/* Desktop Header (Logo on Left, Nav items shifted a bit right) */}
        <div className="hidden lg:flex max-w-[1600px] mx-auto px-8 lg:px-12 py-4 items-center relative min-h-[90px]">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            <img 
              src="/logo.png" 
              alt="Power Flow Logo" 
              className="h-14 lg:h-18 xl:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Navigation Links (Shifted right to match screenshot positioning) */}
          <nav className="flex items-center space-x-8 xl:space-x-10 text-xs font-black tracking-[0.18em] text-gray-800 ml-24 lg:ml-40 xl:ml-56">
            <Link href="/" className={`hover:text-yellow-600 transition-colors uppercase py-2 relative ${isActive('/') ? 'text-yellow-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:rounded-full' : ''}`}>
              HOME
            </Link>
            <Link href="/collections" className={`hover:text-yellow-600 transition-colors uppercase py-2 relative ${isActive('/collections') ? 'text-yellow-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:rounded-full' : ''}`}>
              COLLECTIONS
            </Link>
            <Link href="/best-seller" className={`hover:text-yellow-600 transition-colors uppercase py-2 relative ${isActive('/best-seller') ? 'text-yellow-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:rounded-full' : ''}`}>
              BEST SELLER
            </Link>
            <Link href="/new-arrivals" className={`hover:text-yellow-600 transition-colors uppercase py-2 relative flex items-center gap-1.5 ${isActive('/new-arrivals') ? 'text-yellow-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:rounded-full' : ''}`}>
              <span>NEW ARRIVALS</span>
              <span className="bg-yellow-500 text-black text-[9px] px-1.5 py-0.5 font-black rounded-sm leading-none">NEW</span>
            </Link>
            <Link href="/shop-all" className={`hover:text-yellow-600 transition-colors uppercase py-2 relative ${isActive('/shop-all') ? 'text-yellow-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:rounded-full' : ''}`}>
              SHOP ALL
            </Link>
            <Link href="/faq" className={`hover:text-yellow-600 transition-colors uppercase py-2 relative ${isActive('/faq') ? 'text-yellow-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:rounded-full' : ''}`}>
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile Only) */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Content (Mobile Only) */}
      <div className={`fixed top-0 left-0 h-full w-[80vw] max-w-sm bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="font-black text-gray-900 tracking-widest text-sm uppercase">Menu</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-6 flex flex-col space-y-6 text-sm font-bold text-gray-700 tracking-widest">
          <Link href="/" onClick={() => setSidebarOpen(false)} className={`flex items-center hover:text-yellow-500 transition-colors ${isActive('/') ? 'text-yellow-500' : ''}`}>
            HOME
          </Link>
          <Link href="/collections" onClick={() => setSidebarOpen(false)} className={`flex items-center hover:text-yellow-500 transition-colors ${isActive('/collections') ? 'text-yellow-500' : ''}`}>
            COLLECTIONS
          </Link>
          <Link href="/best-seller" onClick={() => setSidebarOpen(false)} className={`flex items-center hover:text-yellow-500 transition-colors ${isActive('/best-seller') ? 'text-yellow-500' : ''}`}>
            BEST SELLER
          </Link>
          <Link href="/new-arrivals" onClick={() => setSidebarOpen(false)} className={`flex items-center justify-between hover:text-yellow-500 transition-colors ${isActive('/new-arrivals') ? 'text-yellow-500' : ''}`}>
            <span>NEW ARRIVALS</span>
            <span className="bg-yellow-500 text-black text-[9px] px-2 py-0.5 font-black rounded-sm">NEW</span>
          </Link>
          <Link href="/shop-all" onClick={() => setSidebarOpen(false)} className={`flex items-center hover:text-yellow-500 transition-colors ${isActive('/shop-all') ? 'text-yellow-500' : ''}`}>
            SHOP ALL
          </Link>
          <Link href="/faq" onClick={() => setSidebarOpen(false)} className={`flex items-center hover:text-yellow-500 transition-colors ${isActive('/faq') ? 'text-yellow-500' : ''}`}>
            FAQ
          </Link>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center font-medium">
            &copy; {new Date().getFullYear()} Power Flow. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
