'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSettings } from '../lib/useSettings';

export default function SiteFooter() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const whatsappNumber = settings?.whatsappNumber || '+923401013889';

  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/manage-x7k9'))) {
    return null;
  }

  return (
    <>
      <footer className="bg-[#222] text-gray-300 pt-16 pb-8 text-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Col 1 */}
          <div>
            <h4 className="text-white font-bold tracking-widest mb-6">QUICK LINKS</h4>
            <ul className="space-y-3 font-medium text-[13px]">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">Collections</Link></li>
              <li><Link href="/shop-all" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/best-seller" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold tracking-widest mb-6">OUR PRODUCTS</h4>
            <ul className="space-y-3 font-medium text-[13px]">
              <li><Link href="/shop-all?category=Wash Basins" className="hover:text-white transition-colors">Wash Basins</Link></li>
              <li><Link href="/shop-all?category=Toilets" className="hover:text-white transition-colors">Commodes & Toilets</Link></li>
              <li><Link href="/shop-all?category=Showers" className="hover:text-white transition-colors">Showers</Link></li>
              <li><Link href="/shop-all?category=Faucets" className="hover:text-white transition-colors">Faucets & Mixers</Link></li>
              <li><Link href="/shop-all?category=Kitchen Sinks" className="hover:text-white transition-colors">Kitchen Sinks</Link></li>
              <li><Link href="/shop-all?category=Accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold tracking-widest mb-6">CONTACT DETAILS</h4>
            <ul className="space-y-3 text-[13px] leading-relaxed">
              <li><span className="text-white">Office Address:</span> Lahore, Punjab, Pakistan</li>
              <li><span className="text-white">Contact:</span> {whatsappNumber}</li>
              <li><span className="text-white">Email:</span> info@sanitarystore.com</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold tracking-widest mb-6">FOLLOW US</h4>
            <p className="text-[12px] mb-6 text-gray-400">Stay connected for the latest products, offers & updates.</p>
            
            {/* Socials */}
            <div className="flex space-x-4">
              {/* Facebook */}
              <a href="https://www.facebook.com/share/1HsbQDiDpk/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors text-black font-bold text-lg">
                f
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/power.flowpk?stkn=bHYwajlrY3ZlOGNm" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors text-black">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@h2h.enterpises?_r=1&_t=ZS-99hVDLyIoOV" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors text-black">
                <svg className="w-3.5 h-3.5" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Sanitary Store. All Rights Reserved.
        </div>
      </footer>

      {/* Floating WhatsApp Widget */}
      <a 
        href={`https://wa.me/${whatsappNumber.replace('+', '')}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-50 rounded-tl-sm"
      >
        <MessageCircle className="w-8 h-8 text-white fill-white" />
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">1</span>
      </a>
    </>
  );
}
