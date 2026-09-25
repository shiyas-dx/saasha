'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, MapPin, Phone, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount, totalItems } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const estimatedRetailValue = items.reduce((sum, item) => sum + item.retail_mrp * item.quantity, 0);
  const estimatedProfit = estimatedRetailValue - totalAmount;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }

    if (!shippingAddress.trim() || !contactPhone.trim()) {
      setErrorMsg('Please provide a valid delivery address and contact phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
        shipping_address: shippingAddress.trim(),
        contact_phone: contactPhone.trim(),
        notes: notes.trim() || undefined,
      };

      const res = await fetchApi<any>('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      clearCart();
      setOrderSuccess(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit order. Please check stock or login session.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto glass-panel p-8 rounded-3xl border border-emerald-500/30 text-center space-y-5 my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-black text-white">Wholesale Order Placed!</h2>
        <p className="text-xs text-slate-300 max-w-sm mx-auto">
          Your order <strong className="text-brand-400 font-mono text-sm">{orderSuccess.order_number}</strong> has been received by SAASHA warehouse admins.
        </p>

        <div className="bg-slate-900/80 p-4 rounded-2xl text-left space-y-2 text-xs border border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-400">Order Number:</span>
            <span className="font-mono font-bold text-white">{orderSuccess.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Items:</span>
            <span className="font-bold text-white">{orderSuccess.total_items} units</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Amount:</span>
            <span className="font-bold text-brand-400">₹{orderSuccess.total_amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Current Status:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {orderSuccess.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/orders"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            Track Order Status
          </Link>
          <Link
            href="/products"
            className="px-5 py-2.5 glass-card text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
          >
            Continue Wholesale Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto glass-panel p-10 text-center rounded-3xl space-y-4 my-8">
        <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Your Wholesale Cart is Empty</h2>
        <p className="text-xs text-slate-400">
          Browse our direct supplier wholesale catalog to add products for your shop.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-400" />
            Wholesale Cart ({totalItems} items)
          </h1>
          <p className="text-xs text-slate-400">Review your bulk lot quantities before order dispatch</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-slate-400 hover:text-red-400 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-800"
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">SKU: {item.sku}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-brand-400">₹{item.wholesale_price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400">/{item.unit}</span>
                    <span className="text-[10px] text-slate-500 font-semibold bg-slate-800 px-1.5 py-0.5 rounded">
                      MOQ: {item.moq}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-1 py-1">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="text-[10px] text-slate-400 block">Subtotal</span>
                  <span className="text-sm font-black text-white">
                    ₹{(item.wholesale_price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Delivery Details Form */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Wholesale Order Summary
          </h2>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Total Wholesale Cost:</span>
              <span className="font-bold text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Retail Value (MRP):</span>
              <span className="font-medium text-slate-400">₹{estimatedRetailValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
              <span>Expected Retail Margin:</span>
              <span>+₹{estimatedProfit.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmitOrder} className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-400" /> Retail Shop Address *
              </label>
              <textarea
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter shop number, market area, city, pincode..."
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-400" /> Contact Mobile Number *
              </label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-brand-400" /> Warehouse Admin Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special delivery instructions or GST info..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Submitting Order...' : 'Submit Wholesale Order Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
