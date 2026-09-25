import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Clock, Headphones, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-24 md:pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wholesale Value Guarantees Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Direct Wholesale Rates</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">No middleman markup. Verified supplier pricing.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Priority Express Dispatch</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Fast delivery directly to your retail shop door.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Guaranteed Quality</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">100% authentic stock & high profit margins.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Dedicated Multi-Admin Desk</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Direct contact with wholesale warehouse managers.</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Links & Info */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-extrabold text-sm">
              S
            </div>
            <span className="font-bold text-white tracking-wider">SAASHA B2B Wholesale Market</span>
          </div>

          <p className="text-slate-400 text-[11px]">
            &copy; {new Date().getFullYear()} SAASHA Wholesale Technologies. All rights reserved. Designed for retail shopkeepers.
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/products" className="hover:text-white transition-colors">Bulk Catalog</Link>
            <Link href="/cart" className="hover:text-white transition-colors">Cart Checkout</Link>
            <Link href="/admin" className="hover:text-amber-400 transition-colors font-medium">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
