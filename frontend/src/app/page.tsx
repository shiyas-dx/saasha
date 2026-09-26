'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import {
  ArrowRight,
  Cpu,
  Smartphone,
  Wrench,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Layers,
  Sparkles,
  Award,
  CheckCircle2
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
    <div className="space-y-12">
      {/* HIGH-IMPACT B2B HERO SHOWCASE */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Direct Wholesaler of Mobile Phone Spare Parts & Tools</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Stock Your Repair Lab with <span className="text-gradient-cyan">OEM Spare Parts</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              SAASHA supplies original OLED displays, pure cobalt batteries, charging flexes, BGA PMIC ICs, and 1000W rework stations directly to repair shop technicians.
            </p>

            {/* Quick Brand Filter Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 text-[11px] font-bold">Compatibility:</span>
              {['iPhone 15/14', 'Samsung S24/S23', 'Xiaomi / Redmi', 'OnePlus', 'Micro ICs'].map((brand) => (
                <Link
                  key={brand}
                  href={`/products?query=${encodeURIComponent(brand)}`}
                  className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors"
                >
                  {brand}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-400/20 hover:scale-105"
              >
                Browse Spares Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-card hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all border border-slate-700/60"
              >
                Technician Portal
              </Link>
            </div>
          </div>

          {/* Bento Feature Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <Link href="/products?category_id=1" className="group glass-card p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-cyan-400">OLED Displays</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Service Pack Original</p>
            </Link>

            <Link href="/products?category_id=2" className="group glass-card p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-400">Cobalt Batteries</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Zero-Cycle TI IC</p>
            </Link>

            <Link href="/products?category_id=4" className="group glass-card p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-purple-400">Motherboard ICs</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">PMIC & BGA Chips</p>
            </Link>

            <Link href="/products?category_id=7" className="group glass-card p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-amber-400">Repair Stations</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">1000W Hot Air & Solder</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Pills & Highlights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Phone Parts Categories
            </h2>
            <p className="text-xs text-slate-400">Explore inventory by mobile component type</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category_id=${cat.id}`}
              className="group glass-card rounded-2xl p-3 flex flex-col items-center text-center hover:border-cyan-500/50 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden mb-2 relative border border-slate-800 group-hover:scale-105 transition-transform">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-400 transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* High Margin Spares Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              High Margin Parts for Technicians
            </h2>
            <p className="text-xs text-slate-400">Tested components with high repair shop margins</p>
          </div>
          <Link href="/products?is_featured=true" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            Explore All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 bg-slate-900 rounded-2xl" />
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

      {/* New Component Arrivals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              New Wholesale Spares Stock
            </h2>
            <p className="text-xs text-slate-400">Fresh stock added by warehouse admins</p>
          </div>
          <Link href="/products?is_new=true" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View All Arrivals <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 bg-slate-900 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
