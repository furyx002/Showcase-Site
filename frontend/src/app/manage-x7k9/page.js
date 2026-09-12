'use client';

import React, { useState, useEffect } from 'react';
import LoginView from '../../components/LoginView';
import EditSettingsView from '../../components/EditSettingsView';
import { api } from '../../lib/api';
import { LogOut } from 'lucide-react';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('pos_theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (t) => {
    if (t === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('pos_theme', nextTheme);
    applyTheme(nextTheme);
  };

  useEffect(() => {
    const token = localStorage.getItem('store_admin_token');
    const savedUserStr = localStorage.getItem('store_admin_user');

    if (token && savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        setUser(savedUser);
      } catch (e) {
        localStorage.removeItem('store_admin_token');
      }
    }
    setAuthChecked(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('store_admin_token');
    localStorage.removeItem('store_admin_user');
    setUser(null);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center text-xs">
        Loading Admin Console...
      </div>
    );
  }

  if (!user) {
    return <LoginView onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-xl tracking-tighter">
              SS
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-widest text-black leading-none">SANITARY</span>
              <span className="text-sm font-bold tracking-[0.2em] text-gray-500 leading-none mt-1">ADMIN</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button onClick={handleLogout} className="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-wider">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
        <EditSettingsView onRefreshAll={() => {}} />
      </main>
    </div>
  );
}
