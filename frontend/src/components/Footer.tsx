import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, Headphones, Award, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-24 md:pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wholesale Value Guarantees Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Direct Factory Wholesale</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">No middleman markup. Verified supplier pricing.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Express Dispatch</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Fast delivery directly to your repair lab door.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Quality Tested</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Original Service Pack & OEM Grade A+.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Dedicated B2B Desk</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Direct contact with warehouse managers.</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Links & Info */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-wider">SAASHA Mobile Spares & Tools</span>
          </div>

          <p className="text-slate-500 text-[11px]">
            &copy; {new Date().getFullYear()} SAASHA Technologies. All rights reserved. Designed for repair shop technicians.
          </p>

          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600">
            <Link href="/products" className="hover:text-blue-600 transition-colors">Bulk Catalog</Link>
            <Link href="/cart" className="hover:text-blue-600 transition-colors">Cart Checkout</Link>
            <Link href="/admin" className="hover:text-purple-600 transition-colors font-bold text-purple-700">Admin Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
