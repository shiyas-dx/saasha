'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  Cpu,
  Smartphone,
  Zap,
  Wrench,
  Percent
} from 'lucide-react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featRes, newRes, catRes] = await Promise.all([
          fetchApi<any>('/products?is_featured=true&limit=8'),
          fetchApi<any>('/products?is_new=true&limit=8'),
          fetchApi<any>('/categories'),
        ]);
        setFeaturedProducts(featRes.items || []);
        setNewProducts(newRes.items || []);
        setCategories(catRes || []);
      } catch (err) {
        console.error('Failed to fetch home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-10">
      {/* HIGH-IMPACT HERO BANNER (Matching reference screenshot) */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 md:p-12 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Direct Wholesaler for Repair Shops
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Stock Your Repair Lab with <span className="text-blue-400">Latest OEM Spare Parts</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              Discover top-quality OLED screens, pure cobalt batteries, BGA PMIC ICs, and 1000W rework stations directly from wholesale supplier warehouses.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-lg shadow-blue-600/30 hover:scale-105"
              >
                Shop Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?is_featured=true"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-700"
              >
                Explore Deals
              </Link>
            </div>
          </div>

          {/* Right Hero Showcase Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <Link href="/products?category_id=1" className="bg-slate-800/90 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700 transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-white">OLED Displays</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Service Pack Original</p>
            </Link>

            <Link href="/products?category_id=2" className="bg-slate-800/90 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700 transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-white">Power Cells</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Zero-Cycle TI IC</p>
            </Link>

            <Link href="/products?category_id=4" className="bg-slate-800/90 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700 transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto mb-2">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-white">Motherboard ICs</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">PMIC & BGA Chips</p>
            </Link>

            <Link href="/products?category_id=7" className="bg-slate-800/90 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700 transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-white">Lab Equipment</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">1000W Hot Air Gun</p>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST FEATURES BAR (Exact match to reference screenshot bar) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Direct Factory Rates</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">No middleman markup</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Secure B2B Payment</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">100% safe & invoice ready</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Quality Warranty</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">6-month replacement policy</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">24/7 B2B Support</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Dedicated warehouse desk</p>
          </div>
        </div>
      </div>

      {/* SHOP BY CATEGORY SECTION (Matching reference category grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Shop By Category</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Browse Top Electronics Spares</h2>
          </div>
          <Link
            href="/products"
            className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category_id=${cat.id}`}
              className="group bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden mb-3 border border-slate-100 group-hover:scale-105 transition-transform flex items-center justify-center">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 font-medium">Original & OEM</p>
            </Link>
          ))}
        </div>
      </section>

      {/* PROMOTIONAL B2B DEALS BANNER (Matching reference deal banner) */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md inline-flex items-center gap-1">
              <Percent className="w-3 h-3" /> Wholesale Margin Discount
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Big Deals on Top Phone Spares & Lab Stations</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Grab original displays, high-capacity batteries, and micro-soldering stations at unbeatable factory direct rates.
            </p>
          </div>

          <Link
            href="/products?is_featured=true"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 shrink-0"
          >
            Shop Deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* TOP PICKS / FEATURED PRODUCT GRID (Matching reference product picks) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Best Sellers</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Top Picks for Your Shop</h2>
          </div>
          <Link
            href="/products"
            className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            View All Products
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 bg-white rounded-2xl border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
