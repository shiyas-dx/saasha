'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, Search, ShoppingBag, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const MobileNav = () => {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Catalog', href: '/products', icon: Store },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: totalItems },
    ...(isAdmin
      ? [{ label: 'Admin', href: '/admin', icon: ShieldCheck, isHighlight: true }]
      : [{ label: user ? 'Orders' : 'Account', href: user ? '/orders' : '/login', icon: User }]),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-header border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-2 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-brand-400 font-bold bg-brand-500/10'
                  : item.isHighlight
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-brand-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
