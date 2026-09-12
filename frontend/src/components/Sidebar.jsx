'use client';

import React from 'react';
import { 
  LayoutGrid, Users, ShoppingBag, Receipt, SlidersHorizontal, 
  Sun, Moon, LogOut, Sparkles, UserCheck, ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, theme, onToggleTheme }) {
  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col bg-white dark:bg-[#11131a] border-r border-slate-200 dark:border-white/[0.08] min-h-screen p-4 transition-colors duration-200">
      
      {/* Brand Header (POSLINE Style) */}
      <div className="flex items-center space-x-3 px-2 py-3 mb-4 border-b border-slate-100 dark:border-white/[0.06]">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 dark:bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20">
            🎱
          </div>
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            RF SNOOKER <span className="text-blue-600 dark:text-emerald-400">CLUB</span>
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Your POS Console</p>
        </div>
      </div>

      {/* Navigation Menu Links */}
      <nav className="flex-1 space-y-1.5">
        
        <button
          onClick={() => setActiveTab('tables')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-200 ${
            activeTab === 'tables'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <LayoutGrid className="w-4 h-4" />
            <span>3 Snooker Tables</span>
          </div>
          {activeTab === 'tables' && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-200 ${
            activeTab === 'customers'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Users className="w-4 h-4" />
            <span>Active Queue</span>
          </div>
          {activeTab === 'customers' && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
        </button>

        <button
          onClick={() => setActiveTab('pos')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-200 ${
            activeTab === 'pos'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-4 h-4" />
            <span>Bar POS Menu</span>
          </div>
          {activeTab === 'pos' && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-200 ${
            activeTab === 'transactions'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Receipt className="w-4 h-4" />
            <span>Sales History</span>
          </div>
          {activeTab === 'transactions' && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
        </button>

        <button
          onClick={() => setActiveTab('edit')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-200 ${
            activeTab === 'edit'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Edit & Rates</span>
          </div>
          {activeTab === 'edit' && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
        </button>

      </nav>

      {/* Footer / Theme Toggle */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-3">
        
        {/* LIGHT vs DARK MODE TOGGLE BUTTON */}
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181922] text-slate-700 dark:text-zinc-300 hover:border-blue-500 transition-all text-xs font-bold"
        >
          <div className="flex items-center space-x-2">
            {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
        </button>

      </div>

    </aside>
  );
}
