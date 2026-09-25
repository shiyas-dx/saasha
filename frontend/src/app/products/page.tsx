'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, SlidersHorizontal, Store, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('query') || '';
  const initialCat = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : null;
  const initialFeatured = searchParams.get('is_featured') === 'true';
  const initialNew = searchParams.get('is_new') === 'true';

  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState<number | null>(initialCat);
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catRes = await fetchApi<any[]>('/categories');
        setCategories(catRes || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?page=${page}&limit=12&sort_by=${sortBy}`;
        if (query) url += `&query=${encodeURIComponent(query)}`;
        if (categoryId) url += `&category_id=${categoryId}`;
        if (initialFeatured) url += `&is_featured=true`;
        if (initialNew) url += `&is_new=true`;

        const res = await fetchApi<any>(url);
        setProducts(res.items || []);
        setTotalPages(res.pages || 1);
        setTotalItems(res.total || 0);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, categoryId, sortBy, page, initialFeatured, initialNew]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setQuery('');
    setCategoryId(null);
    setSortBy('newest');
    setPage(1);
    router.push('/products');
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Store className="w-6 h-6 text-brand-400" />
            Wholesale Products Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse direct supplier wholesale inventory. Showing {totalItems} available items.
          </p>
        </div>

        {/* Live Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search product name, SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-4 pr-10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          )}
        </form>
      </div>

      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
          <button
            onClick={() => {
              setCategoryId(null);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              categoryId === null
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'glass-card text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategoryId(cat.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                categoryId === cat.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'glass-card text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500 font-medium"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Alphabetical (A-Z)</option>
          </select>

          {(query || categoryId || sortBy !== 'newest') && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-slate-400 hover:text-red-400 flex items-center gap-1 ml-2"
              title="Reset all filters"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Product Grid / Empty State */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-72 bg-slate-900 rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-4">
          <Store className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Wholesale Products Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try tweaking your search terms or clearing category filters to view more items.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-800">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl glass-card text-slate-300 hover:text-white disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl glass-card text-slate-300 hover:text-white disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-slate-400">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
