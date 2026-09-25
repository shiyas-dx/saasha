'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight, Sparkles, TrendingUp, PackageCheck, Zap, Layers, Store, ChevronRight } from 'lucide-react';

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
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-slate-900 to-indigo-950 border border-brand-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct Wholesale Supply Hub for Retailers</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Stock Your Shop with <span className="bg-gradient-to-r from-brand-400 to-indigo-300 bg-clip-text text-transparent">Direct Wholesale Prices</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
            SAASHA connects retail shopkeepers directly with wholesale warehouse admins. Get maximum margins, guaranteed stock availability, and express store delivery.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-lg shadow-brand-600/30 hover:scale-105"
            >
              Browse Bulk Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-card hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all border border-slate-700/60"
            >
              Shopkeeper Portal
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 max-w-lg">
            <div>
              <span className="text-lg sm:text-xl font-black text-white">40-60%</span>
              <span className="block text-[11px] text-slate-400">Retail Profit Margin</span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-amber-400">Low MOQ</span>
              <span className="block text-[11px] text-slate-400">Start Small Lots</span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-emerald-400">24 Hours</span>
              <span className="block text-[11px] text-slate-400">Dispatch Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Browser Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-400" />
              Wholesale Categories
            </h2>
            <p className="text-xs text-slate-400">Explore items by bulk product categories</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category_id=${cat.id}`}
              className="group glass-card rounded-2xl p-3 flex flex-col items-center text-center hover:border-brand-500/50 hover:bg-slate-900 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden mb-2 relative group-hover:scale-110 transition-transform">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xs font-bold text-slate-200 group-hover:text-brand-400 transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Wholesale Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              High Margin Deals
            </h2>
            <p className="text-xs text-slate-400">Top selling wholesale items for shopkeepers</p>
          </div>
          <Link href="/products?is_featured=true" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1">
            See More <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 4, 4].map((n) => (
              <div key={n} className="h-64 bg-slate-900 rounded-2xl" />
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

      {/* New Arrivals Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              New Wholesale Arrivals
            </h2>
            <p className="text-xs text-slate-400">Fresh stock recently added by warehouse admins</p>
          </div>
          <Link href="/products?is_new=true" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Explore All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 bg-slate-900 rounded-2xl" />
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
