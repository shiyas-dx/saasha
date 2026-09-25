'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check, Plus, Minus, Tag, TrendingUp, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    sku: string;
    wholesale_price: number;
    retail_mrp: number;
    unit: string;
    moq: number;
    stock_quantity: number;
    image_url?: string;
    badge_text?: string;
    is_new?: boolean;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(product.moq || 1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const cartItem = items.find((i) => i.product_id === product.id);
  const marginPercent = Math.round(((product.retail_mrp - product.wholesale_price) / product.retail_mrp) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="group glass-card rounded-2xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 relative">
      <div>
        {/* Badges Overlay */}
        <div className="flex items-center justify-between gap-1 mb-2 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.badge_text && (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Tag className="w-2.5 h-2.5" />
                {product.badge_text}
              </span>
            )}
            {marginPercent > 0 && (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" />
                {marginPercent}% Margin
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
            MOQ: {product.moq}
          </span>
        </div>

        {/* Product Image */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square w-full bg-slate-900 rounded-xl overflow-hidden mb-3 group-hover:opacity-95 transition-opacity">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.stock_quantity <= 0 && (
            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-red-400 font-bold text-xs uppercase">
              Out of Stock
            </div>
          )}
        </Link>

        {/* Title & SKU */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2 hover:text-brand-400 transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-[10px] font-mono text-slate-400 mt-1">SKU: {product.sku}</p>
        </Link>
      </div>

      {/* Pricing & Cart Action */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Wholesale Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-brand-400">₹{product.wholesale_price.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-400 font-medium">/{product.unit}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Retail MRP</span>
            <span className="text-xs font-semibold text-slate-400 line-through">
              ₹{product.retail_mrp.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Quantity Controls & Add to Cart */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-1 py-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuantity(Math.max(product.moq, quantity - 1));
              }}
              className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 text-xs transition-colors"
              title="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuantity(quantity + 1);
              }}
              className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 text-xs transition-colors"
              title="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add Bulk
              </>
            )}
          </button>
        </div>

        {cartItem && (
          <div className="mt-2 text-[10px] font-semibold text-brand-300 bg-brand-500/10 px-2 py-1 rounded-lg text-center border border-brand-500/20">
            {cartItem.quantity} units in your cart
          </div>
        )}
      </div>
    </div>
  );
};
