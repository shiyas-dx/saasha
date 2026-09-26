'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check, Plus, Minus, Cpu, ShieldCheck, Zap, Tag, Wrench, Layers } from 'lucide-react';
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
    specifications?: string;
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
    <div className="group glass-card rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-300 relative border border-slate-800/80 hover:border-cyan-500/40">
      <div>
        {/* Top Grade Tag Overlay */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1 flex-wrap">
            {product.badge_text ? (
              <span className="bg-cyan-500/10 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-cyan-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                {product.badge_text}
              </span>
            ) : (
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                OEM Grade A+
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md">
            MOQ: {product.moq}
          </span>
        </div>

        {/* Component Macro Image Container */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square w-full bg-slate-900 rounded-xl overflow-hidden mb-3 border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.stock_quantity <= 0 && (
            <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center text-red-400 font-bold text-xs uppercase tracking-wider">
              Out of Stock
            </div>
          )}
        </Link>

        {/* Component Name & SKU */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2 hover:text-cyan-400 transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-500" /> SKU: <span className="text-slate-300">{product.sku}</span>
          </p>
        </Link>
      </div>

      {/* Price & Bulk Action */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Wholesale Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-cyan-400">₹{product.wholesale_price.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-400 font-medium">/{product.unit}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Repair MRP</span>
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
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center text-xs font-bold text-white font-mono">{quantity}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuantity(quantity + 1);
              }}
              className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 text-xs transition-colors"
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
                : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-400/20'
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
          <div className="mt-2 text-[10px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-lg text-center border border-cyan-500/20">
            {cartItem.quantity} units in your cart
          </div>
        )}
      </div>
    </div>
  );
};
