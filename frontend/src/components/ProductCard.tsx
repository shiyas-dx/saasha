'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check, Plus, Minus, Cpu, ShieldCheck, Tag } from 'lucide-react';
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
    <div className="group bg-white rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 relative border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-500/50">
      <div>
        {/* Top Badges Overlay (Matching reference image style) */}
        <div className="flex items-center justify-between gap-1 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.badge_text ? (
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                {product.badge_text}
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                OEM Grade A+
              </span>
            )}

            {marginPercent > 0 && (
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                {marginPercent}% Margin
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-bold">
            MOQ: {product.moq}
          </span>
        </div>

        {/* Product Component Image */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square w-full bg-slate-50 rounded-xl overflow-hidden mb-3 border border-slate-100 group-hover:border-blue-100 transition-colors">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.stock_quantity <= 0 && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
              Out of Stock
            </div>
          )}
        </Link>

        {/* Product Title & SKU */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-[10px] font-mono text-slate-500 mt-1 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-blue-500" /> SKU: <span className="text-slate-700">{product.sku}</span>
          </p>
        </Link>
      </div>

      {/* Pricing & Cart Action */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Wholesale Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-blue-600">₹{product.wholesale_price.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-500 font-medium">/{product.unit}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Repair MRP</span>
            <span className="text-xs font-semibold text-slate-400 line-through">
              ₹{product.retail_mrp.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Quantity Stepper & Add to Cart Button */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-1 py-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuantity(Math.max(product.moq, quantity - 1));
              }}
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 text-xs transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center text-xs font-bold text-slate-900 font-mono">{quantity}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuantity(quantity + 1);
              }}
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 text-xs transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
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
          <div className="mt-2 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg text-center border border-blue-200">
            {cartItem.quantity} units in cart
          </div>
        )}
      </div>
    </div>
  );
};
