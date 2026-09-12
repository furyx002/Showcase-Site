'use client';

import React, { useState, useEffect } from 'react';
import LoginView from '../../components/LoginView';
import EditSettingsView from '../../components/EditSettingsView';
import { api } from '../../lib/api';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

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
    <EditSettingsView onLogout={handleLogout} />
  );
}
