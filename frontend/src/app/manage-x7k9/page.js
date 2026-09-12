'use client';

import React, { useState, useEffect } from 'react';
import { Package, FolderTree, LayoutDashboard, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-sm -mt-4 -mx-4 md:-mt-8 md:-mx-8 mb-6">
        <h1 className="text-xl font-black text-gray-900 uppercase tracking-widest">
          Dashboard Overview
        </h1>
        <button
          onClick={loadData}
          className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-md transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-yellow-600' : ''}`} />
        </button>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto w-full space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Products</p>
              <h3 className="text-3xl font-black text-gray-900">{products.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <FolderTree className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Categories</p>
              <h3 className="text-3xl font-black text-gray-900">{categories.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <LayoutDashboard className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">System Status</p>
              <h3 className="text-xl font-black text-green-600 uppercase tracking-wider">Online</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
