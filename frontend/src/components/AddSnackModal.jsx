'use client';
import React, { useState, useEffect } from 'react';
import { X, Plus, ShoppingCart, Search, Check } from 'lucide-react';
import { api } from '../lib/api';

export default function AddSnackModal({ table, isOpen, onClose, onAddItem }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    if (isOpen) {
      api.getProducts()
        .then(res => setProducts(res.data || []))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen || !table) return null;

  const categories = ['All', 'Drinks', 'Snacks', 'Accessories'];

  const filteredProducts = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = async (product) => {
    setLoading(true);
    await onAddItem(table.tableNumber, {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    setAddedItem(product._id);
    setTimeout(() => setAddedItem(null), 1000);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#121319] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-slate-900 dark:text-white">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-white/[0.08] flex justify-between items-center bg-slate-50/50 dark:bg-[#181922]/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Add Bar Order to Table {table.tableNumber}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Customer: <strong className="text-blue-600 dark:text-blue-400 font-mono">{table.activeSession?.customerNo}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.08]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#0d0e14] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drinks, snacks, accessories..."
              className="w-full bg-white dark:bg-[#121319] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  category === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-[#181922] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/[0.08] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProducts.map(p => (
            <div
              key={p._id}
              className="bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/[0.08] hover:border-blue-500 rounded-2xl p-3.5 flex items-center justify-between transition-all group"
            >
              <div>
                <span className="text-[10px] uppercase font-black text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/20">
                  {p.category}
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white pt-1">{p.name}</h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 font-mono font-black">PKR {Number(p.price).toFixed(2)}</p>
              </div>

              <button
                onClick={() => handleAdd(p)}
                disabled={loading}
                className={`p-2.5 rounded-xl font-extrabold transition-all flex items-center space-x-1 ${
                  addedItem === p._id
                    ? 'bg-emerald-600 text-white scale-105'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30'
                }`}
              >
                {addedItem === p._id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-xs">Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span className="text-xs">Add</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#0d0e14] flex justify-between items-center">
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Total Items Attached: <strong className="text-slate-900 dark:text-white font-mono font-bold">{table.activeSession?.orders?.length || 0}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-colors shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
