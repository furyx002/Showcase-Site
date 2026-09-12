'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { useSettings } from '../lib/useSettings';

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();

  // Hide header on admin routes (POS system)
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/manage-x7k9'))) {
    return null;
  }

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* Top Banner */}
      <div className="bg-black text-white text-[10px] sm:text-xs py-2 px-4 flex justify-between items-center tracking-wider font-medium overflow-hidden">
        <div className="flex-1 animate-marquee-container">
          <div className="animate-marquee">
            <span className="mr-32">LIMITED TIME OFFER: ENJOY FREE SHIPPING NATIONWIDE</span>
            <span className="mr-32">LIMITED TIME OFFER: ENJOY FREE SHIPPING NATIONWIDE</span>
            <span className="mr-32">LIMITED TIME OFFER: ENJOY FREE SHIPPING NATIONWIDE</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-5 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Power Flow Logo" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8 text-[13px] font-bold text-gray-700 tracking-wider">
            <Link href="/" className={`hover:text-yellow-500 transition-colors ${isActive('/') ? 'text-yellow-500' : ''}`}>
              HOME
            </Link>
            <Link href="/collections" className={`hover:text-yellow-500 transition-colors ${isActive('/collections') ? 'text-yellow-500' : ''}`}>
              COLLECTIONS
            </Link>
            <Link href="/best-seller" className={`hover:text-yellow-500 transition-colors ${isActive('/best-seller') ? 'text-yellow-500' : ''}`}>
              BEST SELLER
            </Link>
            <div className="relative group cursor-pointer">
              <Link href="/new-arrivals" className={`hover:text-yellow-500 transition-colors ${isActive('/new-arrivals') ? 'text-yellow-500' : ''}`}>
                NEW ARRIVALS
              </Link>
              <span className="absolute -top-3 -right-2 bg-yellow-500 text-black text-[9px] px-1.5 py-0.5 font-bold rounded-sm pointer-events-none">New</span>
            </div>
            <Link href="/shop-all" className={`hover:text-yellow-500 transition-colors ${isActive('/shop-all') ? 'text-yellow-500' : ''}`}>
              SHOP ALL
            </Link>
            <Link href="/faq" className={`hover:text-yellow-500 transition-colors ${isActive('/faq') ? 'text-yellow-500' : ''}`}>
              FAQ
            </Link>
          </nav>

          {/* Empty div to balance flex space-between */}
          <div className="w-[100px] hidden lg:block"></div>
        </div>
      </header>
    </>
  );
}
