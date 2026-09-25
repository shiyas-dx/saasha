'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, ShieldCheck, Cpu, Smartphone, Wrench, Crown, LogOut, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const Navbar = () => {
  const router = useRouter();
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-header">
      {/* Top Banner Notice for Wholesale Tech Parts */}
      <div className="bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 py-1.5 px-4 text-center text-xs text-cyan-200 flex items-center justify-center gap-2 font-medium border-b border-cyan-500/10">
        <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-cyan-500/30 flex items-center gap-1">
          <Cpu className="w-3 h-3 text-cyan-400" /> B2B Mobile Spares & Lab Equipment
        </span>
        <span className="hidden sm:inline">Direct Factory Rates for Repair Shops, Technicians & Service Centers</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                SAASHA
              </span>
              <span className="bg-cyan-500/10 text-cyan-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20">
                SPARES
              </span>
            </div>
            <span className="text-[9px] text-slate-400 -mt-0.5 font-semibold tracking-widest uppercase">
              Mobile Parts & Tools Wholesale
            </span>
          </div>
        </Link>

        {/* Search Bar with live model suggestion prompt */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search parts by phone model (e.g. iPhone 14, S23 Ultra, PMIC IC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-full py-2 pl-4 pr-10 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-cyan-600 rounded-full flex items-center justify-center text-white hover:bg-cyan-500 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <Store className="w-4 h-4 text-cyan-400" />
            Spares Catalog
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                isSuperAdmin
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {isSuperAdmin ? <Crown className="w-4 h-4 text-purple-400" /> : <ShieldCheck className="w-4 h-4 text-amber-400" />}
              {isSuperAdmin ? 'Superadmin Desk' : 'Admin Desk'}
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
            title="Bulk Spares Cart"
          >
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                  {user.shop_name || user.full_name}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 glass-panel rounded-2xl p-2 shadow-2xl z-50 border border-cyan-500/30 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    {user.shop_name && (
                      <p className="text-[10px] font-semibold text-cyan-400 mt-0.5">{user.shop_name}</p>
                    )}
                  </div>
                  <div className="py-1">
                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 rounded-lg transition-colors"
                    >
                      My Spares Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors font-medium"
                      >
                        Management Console
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 px-4 py-2 rounded-xl transition-all shadow-md shadow-cyan-400/20"
            >
              <User className="w-4 h-4" />
              Technician Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
