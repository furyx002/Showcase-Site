'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Settings,
  FolderTree,
  LogOut,
  X,
  Menu
} from 'lucide-react';
import LoginView from '../../components/LoginView';

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

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
    router.push('/manage-x7k9');
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

  const navItems = [
    { id: 'dashboard', href: '/manage-x7k9', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'products', href: '/manage-x7k9/products', icon: Package, label: 'Products' },
    { id: 'categories', href: '/manage-x7k9/categories', icon: FolderTree, label: 'Categories' },
    { id: 'settings', href: '/manage-x7k9/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans selection:bg-yellow-200">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-500 text-slate-900 flex items-center justify-center font-black text-xs rounded-md shadow-sm">
              HS
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-wider text-xs uppercase text-white truncate max-w-[130px]">
                {user?.name || 'Huzaifa Shah'}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isReallyActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-colors tracking-wide ${
                  isReallyActive 
                    ? 'bg-yellow-500 text-slate-900' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-2">
          <div className="px-4 py-1 text-xs text-slate-400 font-medium truncate">
            Logged in as <span className="text-white font-bold">{user?.name || 'Huzaifa Shah'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors tracking-wide"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs rounded-md">
              HS
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-widest text-xs uppercase text-black">
                {user?.name || 'Huzaifa Shah'}
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
