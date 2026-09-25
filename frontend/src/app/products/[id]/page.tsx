'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingCart, Check, Plus, Minus, Tag, TrendingUp, ShieldCheck, Box, AlertCircle } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchApi<any>(`/products/${id}`);
        setProduct(data);
        setQuantity(data.moq || 1);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 glass-panel rounded-3xl animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-800 rounded" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-900 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-800 rounded w-3/4" />
            <div className="h-20 bg-slate-800 rounded" />
            <div className="h-12 bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <Link href="/products" className="inline-block px-4 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const marginPercent = Math.round(((product.retail_mrp - product.wholesale_price) / product.retail_mrp) * 100);
  const profitPerUnit = product.retail_mrp - product.wholesale_price;
  const totalWholesaleCost = product.wholesale_price * quantity;
  const totalRetailValue = product.retail_mrp * quantity;
  const totalBatchProfit = profitPerUnit * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 grid md:grid-cols-2 gap-8 items-start">
        {/* Product Image */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-800">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge_text && (
              <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-lg">
                {product.badge_text}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>SKU: <strong className="text-slate-200 font-mono">{product.sku}</strong></span>
            <span>Category: <strong className="text-brand-400">{product.category?.name || 'General Wholesale'}</strong></span>
          </div>
        </div>

        {/* Product Details & Wholesale Calculator */}
        <div className="space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">{product.name}</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{product.description}</p>
          </div>

          {/* Wholesale Pricing Breakdown Card */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Wholesale Rate</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-brand-400">₹{product.wholesale_price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-400">/{product.unit}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Retail MRP</span>
                <span className="text-base font-bold text-slate-400 line-through">
                  ₹{product.retail_mrp.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Profit Callout */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>Profit per {product.unit}:</span>
              </div>
              <span className="font-extrabold text-emerald-400 text-sm">
                +₹{profitPerUnit.toLocaleString('en-IN')} ({marginPercent}% Margin)
              </span>
            </div>
          </div>

          {/* MOQ & Stock */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="glass-card p-3 rounded-xl flex items-center gap-2">
              <Box className="w-4 h-4 text-brand-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Min. Order (MOQ)</span>
                <span className="font-bold text-white">{product.moq} {product.unit}</span>
              </div>
            </div>
            <div className="glass-card p-3 rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Stock Status</span>
                <span className="font-bold text-emerald-400">{product.stock_quantity} available</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector & Batch Calculation */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 block">Select Order Quantity ({product.unit}):</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(product.moq, quantity - 1))}
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value)))}
                  className="w-16 text-center font-extrabold text-white bg-transparent focus:outline-none"
                  min={product.moq}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 text-right">
                <span className="text-[11px] text-slate-400 block">Total Batch Investment:</span>
                <span className="text-xl font-black text-white">₹{totalWholesaleCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Estimated Batch Profit Banner */}
            <div className="text-[11px] text-brand-300 bg-brand-500/10 p-2.5 rounded-xl border border-brand-500/20 flex items-center justify-between">
              <span>Potential Retail Revenue: <strong>₹{totalRetailValue.toLocaleString('en-IN')}</strong></span>
              <span className="font-bold text-emerald-400">Total Profit: +₹{totalBatchProfit.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              addedAnimation
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
            } disabled:opacity-50`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-5 h-5" /> Added {quantity} {product.unit} to Wholesale Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Add {quantity} {product.unit} to Wholesale Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
