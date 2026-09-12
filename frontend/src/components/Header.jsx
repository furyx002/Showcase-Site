'use client';
import React, { useState, useEffect } from 'react';
import { 
  Circle, Clock, LayoutGrid, Users, ShoppingBag, Receipt, 
  SlidersHorizontal, Sparkles, LogOut, UserCheck, Sun, Moon, Search
} from 'lucide-react';
import { api } from '../lib/api';

export default function Header({ activeTab, setActiveTab, user, onLogout, theme, onToggleTheme }) {
  const [time, setTime] = useState('');
  const [nextCustNo, setNextCustNo] = useState('CUST-1001');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    }, 1000);
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.getNextCustomerNo()
      .then(res => { if (res.customerNo) setNextCustNo(res.customerNo); })
      .catch(() => {});
  }, [activeTab]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#11131a]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Title & Mobile Brand */}
          <div className="flex items-center space-x-3">
            <div className="md:hidden flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                🎱
              </div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                RF SNOOKER <span className="text-blue-600 dark:text-blue-400">CLUB</span>
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {activeTab === 'tables' && 'Order Line & Tables Console'}
                {activeTab === 'customers' && 'Active Customers Queue'}
                {activeTab === 'pos' && 'Bar & Snack POS Menu'}
                {activeTab === 'transactions' && 'Sales History & Analytics'}
                {activeTab === 'edit' && 'Edit Rates & Settings'}
              </h2>
            </div>
          </div>

          {/* Right Header Action Items */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Next Automated Customer Tag */}
            <div className="hidden xl:flex items-center bg-slate-100 dark:bg-[#181922] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-1.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 animate-spin" style={{ animationDuration: '8s' }} />
              <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
                Next Customer ID: <strong className="text-slate-900 dark:text-white font-mono font-bold">{nextCustNo}</strong>
              </div>
            </div>

            {/* Live LED Clock */}
            <div className="bg-slate-100 dark:bg-[#181922] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3 py-1.5 font-digital text-xs text-blue-600 dark:text-blue-400 font-bold tracking-wider shadow-inner flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span>{time || '00:00:00'}</span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#181922] text-slate-700 dark:text-zinc-300 hover:border-blue-500 transition-all text-xs font-bold flex items-center space-x-1.5"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span className="hidden sm:inline">{theme === 'light' ? 'Light' : 'Dark'}</span>
            </button>

            {/* Single User Session & Logout Pill */}
            {user && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center text-xs font-bold text-slate-800 dark:text-zinc-200 bg-slate-100 dark:bg-[#181922] border border-slate-200 dark:border-white/[0.08] px-3 py-1.5 rounded-2xl shadow-xs">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mr-1.5" />
                  <span className="truncate max-w-[120px]">{user.email?.split('@')[0]}</span>
                </span>
                
                <button
                  onClick={onLogout}
                  className="p-2 sm:px-3 sm:py-1.5 bg-slate-100 dark:bg-[#181922] hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-500/10 border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center space-x-1 shadow-xs"
                  title="Sign out of POS"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-200 dark:border-white/[0.06] text-[10px]">
          <button 
            onClick={() => setActiveTab('tables')} 
            className={`p-1.5 rounded-xl flex flex-col items-center w-full transition-all duration-200 ${
              activeTab === 'tables' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/[0.06]' : 'text-slate-500 dark:text-zinc-400'
            }`}
          >
            <LayoutGrid className="w-4 h-4 mb-0.5" />
            <span>Tables</span>
          </button>

          <button 
            onClick={() => setActiveTab('customers')} 
            className={`p-1.5 rounded-xl flex flex-col items-center w-full transition-all duration-200 ${
              activeTab === 'customers' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/[0.06]' : 'text-slate-500 dark:text-zinc-400'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span>Queue</span>
          </button>

          <button 
            onClick={() => setActiveTab('pos')} 
            className={`p-1.5 rounded-xl flex flex-col items-center w-full transition-all duration-200 ${
              activeTab === 'pos' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/[0.06]' : 'text-slate-500 dark:text-zinc-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            <span>Bar POS</span>
          </button>

          <button 
            onClick={() => setActiveTab('transactions')} 
            className={`p-1.5 rounded-xl flex flex-col items-center w-full transition-all duration-200 ${
              activeTab === 'transactions' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/[0.06]' : 'text-slate-500 dark:text-zinc-400'
            }`}
          >
            <Receipt className="w-4 h-4 mb-0.5" />
            <span>History</span>
          </button>

          <button 
            onClick={() => setActiveTab('edit')} 
            className={`p-1.5 rounded-xl flex flex-col items-center w-full transition-all duration-200 ${
              activeTab === 'edit' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/[0.06]' : 'text-slate-500 dark:text-zinc-400'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 mb-0.5" />
            <span>Edit</span>
          </button>
        </div>

      </div>
    </header>
  );
}
