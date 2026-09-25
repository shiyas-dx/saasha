'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, Truck, CheckCircle, XCircle, ArrowRight, Store } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders');
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await fetchApi<any[]>('/orders');
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user, authLoading, router]);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">APPROVED</span>;
      case 'PROCESSING':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">PROCESSING IN WAREHOUSE</span>;
      case 'SHIPPED':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">OUT FOR DISPATCH</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">DELIVERED TO SHOP</span>;
      case 'CANCELLED':
        return <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">CANCELLED</span>;
      default:
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">PENDING ADMIN APPROVAL</span>;
    }
  };

  if (loading || authLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-900 rounded w-48" />
        <div className="h-32 bg-slate-900 rounded-2xl" />
        <div className="h-32 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-brand-400" />
          Shopkeeper Order History
        </h1>
        <p className="text-xs text-slate-400 mt-1">Track status and dispatch details of your wholesale stock orders.</p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel p-10 text-center rounded-3xl space-y-4">
          <Store className="w-12 h-12 text-slate-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Orders Placed Yet</h2>
          <p className="text-xs text-slate-400">You haven't placed any bulk wholesale orders yet.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs transition-all">
            Browse Wholesale Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
              {/* Top Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Order No.</span>
                  <span className="font-mono text-sm font-black text-white">{order.order_number}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Date Placed</span>
                  <span className="text-xs text-slate-300 font-medium">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Total Amount</span>
                  <span className="text-sm font-black text-brand-400">₹{order.total_amount.toLocaleString('en-IN')}</span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Items list */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Items in Order:</span>
                <div className="grid sm:grid-cols-2 gap-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block truncate max-w-[200px]">{item.product_name}</span>
                        <span className="text-[10px] text-slate-400">
                          ₹{item.unit_price} x {item.quantity} units
                        </span>
                      </div>
                      <span className="font-bold text-slate-200">₹{item.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping info */}
              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl flex items-center justify-between">
                <span>Shipping Address: <strong className="text-slate-200">{order.shipping_address}</strong></span>
                <span>Contact: <strong className="text-slate-200">{order.contact_phone}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
