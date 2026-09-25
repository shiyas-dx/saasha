'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, ShieldCheck, Store, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const Navbar = () => {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
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
    <header className="sticky top-0 z-40 glass-header border-b border-slate-800/80">
      {/* Top Banner Notice for Wholesale */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-brand-900 py-1.5 px-4 text-center text-xs text-brand-200 flex items-center justify-center gap-2 font-medium">
        <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-amber-500/30">
          B2B Wholesale Only
        </span>
        <span>Direct Supplier Rates for Verified Retail Shopkeepers</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-xl tracking-wider">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white group-hover:text-brand-400 transition-colors">
              SAASHA
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 font-semibold tracking-widest uppercase">
              Wholesale Market
            </span>
          </div>
        </Link>

        {/* Search Bar - Hidden on small mobile header, accessible via bottom nav search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search wholesale products, SKU, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/60 rounded-full py-2 pl-4 pr-10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center text-white hover:bg-brand-500 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Navigation & User Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <Store className="w-4 h-4 text-brand-400" />
            Catalog
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Admin Portal
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Wholesale Cart"
          >
            <ShoppingBag className="w-5 h-5 text-brand-400" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
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
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                  {user.shop_name || user.full_name}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl z-50 border border-slate-700/60 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    {user.shop_name && (
                      <p className="text-[10px] font-semibold text-brand-400 mt-0.5">{user.shop_name}</p>
                    )}
                  </div>
                  <div className="py-1">
                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 rounded-lg transition-colors"
                    >
                      My Wholesale Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors font-medium"
                      >
                        Admin Control Panel
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-600/30"
            >
              <User className="w-4 h-4" />
              Shopkeeper Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
