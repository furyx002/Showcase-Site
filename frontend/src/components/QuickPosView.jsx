'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, Search, Sparkles, Zap, Printer, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import ThermalReceipt from './ThermalReceipt';
import confetti from 'canvas-confetti';

export default function QuickPosView() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [nextCustNo, setNextCustNo] = useState('CUST-1001');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const loadCatalog = async () => {
    try {
      const [resProd, resCust] = await Promise.all([
        api.getProducts(),
        api.getNextCustomerNo()
      ]);
      setProducts(resProd.data || []);
      if (resCust.customerNo) {
        setNextCustNo(resCust.customerNo);
        setCustomerName(`Walk-in (${resCust.customerNo})`);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item._id === product._id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!cart.length) return;
    setLoading(true);
    try {
      const res = await api.createDirectOrder({
        items: cart,
        customerName,
        paymentMethod
      });
      setCompletedOrder(res.data);
      setCart([]);
      
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch (e) {}

      api.getNextCustomerNo().then(r => {
        if (r.customerNo) {
          setNextCustNo(r.customerNo);
          setCustomerName(`Walk-in (${r.customerNo})`);
        }
      });

    } catch (err) {
      alert(err.message || 'Sale failed');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Drinks', 'Snacks', 'Accessories'];
  const filteredProducts = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      
      {/* Left 2 Columns: Product Catalog */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Search & Categories Card */}
        <div className="posline-card p-4 space-y-3 bg-white dark:bg-[#121319]">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Bar & Snack POS Menu</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Direct counter sales catalog for snacks & beverages.</p>
            </div>
            
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog..."
                className="w-full bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  category === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-[#181922] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/[0.08] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredProducts.map(p => (
            <div
              key={p._id}
              onClick={() => addToCart(p)}
              className="posline-card p-4 cursor-pointer flex flex-col justify-between space-y-3 group bg-white dark:bg-[#121319] hover:border-blue-500 transition-all duration-200 shadow-xs"
            >
              <div>
                <span className="text-[10px] uppercase font-black text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-500/20 inline-block">
                  {p.category}
                </span>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white pt-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {p.name}
                </h3>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                <span className="font-mono text-xs font-black text-slate-900 dark:text-white">PKR {Number(p.price).toFixed(2)}</span>
                <button className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Right Column: Cart & Direct Checkout */}
      <div className="space-y-4">
        <div className="posline-card p-5 bg-white dark:bg-[#121319] space-y-4">
          
          {/* Automated Customer Tag Badge */}
          <div className="bg-slate-50 dark:bg-[#0d0e14] p-3.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] flex justify-between items-center text-xs">
            <div>
              <div className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400 flex items-center">
                <Sparkles className="w-3 h-3 mr-1 animate-spin" style={{ animationDuration: '8s' }} />
                Customer No: Automated
              </div>
              <div className="text-slate-500 dark:text-zinc-400 font-medium">Counter Bar Sale</div>
            </div>
            <span className="font-mono text-xs font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2.5 py-1 rounded-xl">
              {nextCustNo}
            </span>
          </div>

          {/* Cart Header */}
          <div className="flex items-center justify-between text-xs font-black text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-white/[0.06] pb-2.5">
            <span className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
            </span>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-slate-400 hover:text-red-500 text-xs font-bold transition-colors">
                Clear All
              </button>
            )}
          </div>

          {/* Cart Items List */}
          {cart.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item._id} className="bg-slate-50 dark:bg-[#0d0e14] p-3 rounded-2xl border border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-slate-500 dark:text-zinc-400 font-mono text-[11px]">PKR {Number(item.price).toFixed(2)}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-1 text-xs">
                      <button onClick={() => updateQuantity(item._id, -1)} className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold px-1 text-blue-600 dark:text-blue-400">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)} className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item._id)} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500 italic font-medium">
              Select items from catalog to build order
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.06] text-xs">
            <label className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-400 tracking-wider">Payment Method:</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['CASH', 'CARD', 'ONLINE'].map(m => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 rounded-xl font-extrabold border transition-all ${
                    paymentMethod === m 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30' 
                      : 'bg-slate-50 dark:bg-[#0d0e14] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Total & Checkout Button */}
          <div className="pt-2 space-y-3">
            <div className="flex justify-between items-center text-xs font-extrabold text-slate-900 dark:text-white bg-slate-50 dark:bg-[#0d0e14] p-3.5 rounded-2xl border border-slate-200 dark:border-white/[0.08]">
              <span>Total Amount:</span>
              <span className="font-mono text-xl font-black text-blue-600 dark:text-blue-400">PKR {subtotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || !cart.length}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs shadow-md shadow-blue-600/30 transition-all disabled:opacity-50 active:scale-98"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{loading ? 'Processing POS Sale...' : 'Complete POS Sale'}</span>
            </button>
          </div>

        </div>

        {/* Thermal Receipt Preview */}
        {completedOrder && (
          <div className="posline-card p-5 bg-white dark:bg-[#121319] border-blue-500/40 space-y-3 text-center">
            <div className="text-blue-600 dark:text-blue-400 font-extrabold text-xs flex items-center justify-center space-x-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Sale Complete #{completedOrder.orderNo}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#0d0e14] p-3 rounded-2xl border border-slate-200 dark:border-white/[0.08] flex justify-center">
              <ThermalReceipt order={completedOrder} />
            </div>
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Thermal Receipt</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
