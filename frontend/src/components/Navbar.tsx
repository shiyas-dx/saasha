'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Search, User, ShieldCheck, Cpu, Store, LogOut, Phone, HelpCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Announcement Bar (like ElectroShop reference) */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
              B2B Wholesale
            </span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              Free Express Dispatch on Bulk Orders | Direct Supplier Rates
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-blue-400" /> Dedicated B2B Desk
            </span>
            <span className="hidden md:flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" /> Help Center
            </span>
            {user ? (
              <span className="text-slate-200 font-bold">Hi, {user.shop_name || user.full_name}</span>
            ) : (
              <Link href="/login" className="text-blue-400 font-bold hover:underline">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:bg-blue-700 transition-colors">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                SAASHA
              </span>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                Spares
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase -mt-0.5">
              Mobile Parts & Tools
            </span>
          </div>
        </Link>

        {/* Center Nav Links (matching reference image) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <Link href="/" className={`hover:text-blue-600 transition-colors ${pathname === '/' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1' : ''}`}>
            Home
          </Link>
          <Link href="/products" className={`hover:text-blue-600 transition-colors ${pathname === '/products' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1' : ''}`}>
            Catalog
          </Link>
          <Link href="/products?category_id=1" className="hover:text-blue-600 transition-colors">
            OLED Displays
          </Link>
          <Link href="/products?category_id=2" className="hover:text-blue-600 transition-colors">
            Batteries
          </Link>
          <Link href="/products?is_featured=true" className="hover:text-blue-600 transition-colors text-amber-600 font-bold flex items-center gap-1">
            MOQ Deals
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-purple-600 hover:text-purple-700 font-bold bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
              {isSuperAdmin ? 'Superadmin Desk' : 'Admin Desk'}
            </Link>
          )}
        </nav>

        {/* Right Search & Cart Actions */}
        <div className="flex items-center gap-4 flex-1 lg:flex-none justify-end">
          {/* Top Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative w-64 lg:w-72">
            <input
              type="text"
              placeholder="Search parts, models, SKUs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Cart Icon Trigger */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2"
            title="Bulk Spares Cart"
          >
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <span className="hidden xl:inline text-xs font-bold text-slate-900">Cart</span>
            {totalItems > 0 && (
              <span className="bg-blue-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* User Account */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl p-2 shadow-xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    {user.shop_name && (
                      <p className="text-[10px] font-bold text-blue-600 mt-0.5">{user.shop_name}</p>
                    )}
                  </div>
                  <div className="py-1">
                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
                    >
                      My Spares Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 text-xs text-purple-600 hover:bg-purple-50 rounded-lg font-bold"
                      >
                        Management Console
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium text-left"
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
