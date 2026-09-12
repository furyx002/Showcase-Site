'use client';

import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';

export default function LoginView({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(email, password);
      if (res.success && res.data) {
        localStorage.setItem('store_admin_token', res.data.token);
        localStorage.setItem('store_admin_user', JSON.stringify(res.data.user));
        if (onLoginSuccess) onLoginSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#08090d] text-zinc-100 font-sans relative overflow-hidden">
      
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 animate-fade-in-up">
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-300"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-[#121319] border border-white/10 flex items-center justify-center text-3xl mx-auto shadow-2xl">
              📦
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center">
              SANITARY <span className="text-blue-500 font-black ml-1.5">STORE</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-medium">Store Admin Console</p>
          </div>
        </div>

        {/* Login Form Card */}
        <form onSubmit={handleLogin} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in-up delay-100">
          
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Admin Authentication</span>
            </span>
            <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase">
              Encrypted Session
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-300 text-center font-semibold animate-shake">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email address"
              className="w-full bg-[#0d0e14] border border-white/[0.08] focus:border-blue-500/60 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#0d0e14] border border-white/[0.08] focus:border-blue-500/60 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none font-mono transition-all duration-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all duration-200 shadow-lg shadow-blue-600/30 disabled:opacity-50 active:scale-98 transform mt-2"
          >
            <span>{loading ? 'Authenticating Credentials...' : 'Sign In to Admin Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <p className="text-center text-[11px] text-zinc-500 font-medium animate-fade-in-up delay-200">
          Sanitary Store Admin System • 2026
        </p>
      </div>
    </div>
  );
}
