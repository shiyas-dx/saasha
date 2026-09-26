'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Store,
  MapPin,
  Phone,
  FileText,
  Calendar,
  Box,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

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

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status.toUpperCase() === filterStatus);

  const getStepProgress = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 1;
      case 'APPROVED': return 2;
      case 'PROCESSING': return 3;
      case 'SHIPPED': return 4;
      case 'DELIVERED': return 5;
      case 'CANCELLED': return 0;
      default: return 1;
    }
  };

  if (loading || authLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-48 bg-white rounded-3xl border border-slate-200" />
        <div className="h-48 bg-white rounded-3xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">B2B Fulfillment Portal</span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Shopkeeper Orders & Dispatch Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time shipment status, courier tracking IDs, and estimated delivery dates.
          </p>
        </div>

        <Link
          href="/products"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 shrink-0"
        >
          New Wholesale Order <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {['ALL', 'PENDING', 'APPROVED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === st
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st} {st === 'ALL' ? `(${orders.length})` : ''}
          </button>
        ))}
      </div>

      {/* Order List / Tracking Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <Store className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">No Orders Found</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any wholesale stock orders matching this status filter.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md"
          >
            Browse Wholesale Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const stepProgress = getStepProgress(order.status);
            const isCancelled = order.status.toUpperCase() === 'CANCELLED';

            return (
              <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                {/* Top Summary Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Order Number</span>
                    <span className="font-mono text-base font-black text-blue-600">{order.order_number}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Courier & Tracking Highlight */}
                  {order.tracking_number && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-xs flex items-center gap-3">
                      <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Carrier & Tracking</span>
                        <span className="font-bold text-slate-900">
                          {order.courier_name || 'BlueDart B2B'} • <strong className="font-mono text-blue-600">{order.tracking_number}</strong>
                        </span>
                        {order.estimated_delivery && (
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            Est. Arrival: <strong className="text-slate-700">{order.estimated_delivery}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Amount</span>
                    <span className="text-lg font-black text-slate-900">₹{order.total_amount.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-slate-500 block">{order.total_items} items total</span>
                  </div>
                </div>

                {/* VISUAL ORDER TIMELINE STEPPER */}
                {!isCancelled ? (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Live Fulfillment Timeline:</span>
                    <div className="grid grid-cols-5 gap-2 pt-2">
                      {[
                        { step: 1, label: 'Order Placed', sub: 'Pending Review' },
                        { step: 2, label: 'Approved', sub: 'Stock Reserved' },
                        { step: 3, label: 'Processing', sub: 'Boxed in Lab' },
                        { step: 4, label: 'In Transit', sub: 'Shipped' },
                        { step: 5, label: 'Delivered', sub: 'At Shop' },
                      ].map((st) => {
                        const isCompleted = stepProgress >= st.step;
                        const isCurrent = stepProgress === st.step;

                        return (
                          <div key={st.step} className="flex flex-col items-center text-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                                isCompleted
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : st.step}
                            </div>
                            <span className={`text-[11px] font-bold mt-1.5 ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                              {st.label}
                            </span>
                            <span className="text-[9px] text-slate-400 hidden sm:block">{st.sub}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Order Cancelled</span>
                  </div>
                )}

                {/* Items Breakdown Table */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Items in Order:</span>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block truncate max-w-[220px]">{item.product_name}</span>
                          <span className="text-[11px] text-slate-500">
                            ₹{item.unit_price.toLocaleString('en-IN')} x {item.quantity} qty
                          </span>
                        </div>
                        <span className="font-bold text-blue-600">₹{item.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address Details */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Delivery Address: <strong className="text-slate-900">{order.shipping_address}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Contact: <strong className="text-slate-900">{order.contact_phone}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
