'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Crown,
  Package,
  TrendingUp,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, isSuperAdmin, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'users'>('orders');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New product form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category_id: 1,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80',
    unit: 'Box (5 pcs)',
    wholesale_price: 2500,
    retail_mrp: 5000,
    moq: 1,
    stock_quantity: 50,
    badge_text: 'Service Pack',
    is_featured: false,
    is_new: true,
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, prodRes, catRes, userRes] = await Promise.all([
        fetchApi<any>('/admin/stats'),
        fetchApi<any[]>('/admin/orders'),
        fetchApi<any>('/products?limit=100'),
        fetchApi<any[]>('/categories'),
        fetchApi<any[]>('/admin/users'),
      ]);
      setStats(statsRes);
      setOrders(ordersRes || []);
      setProducts(prodRes.items || []);
      setCategories(catRes || []);
      setUsersList(userRes || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/login');
      return;
    }
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin, authLoading, router]);

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await fetchApi(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      loadAdminData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productForm),
      });
      setShowAddProductModal(false);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetchApi(`/admin/products/${productId}`, { method: 'DELETE' });
      loadAdminData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading || authLoading) {
    return <div className="text-center py-20 text-slate-400 font-bold">Loading Management Console...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Warehouse Management Desk
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">SAASHA Spares Control Center</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Logged in as Admin: <strong className="text-cyan-400">{user?.full_name}</strong> ({user?.email})
          </p>
        </div>

        <button
          onClick={() => setShowAddProductModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-400/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Wholesale Item
        </button>
      </div>

      {/* Overview Stats Cards Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Revenue</span>
            <div className="text-lg sm:text-2xl font-black text-emerald-400 mt-1">₹{stats.total_revenue.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-slate-400">All fulfilled orders</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending Orders</span>
            <div className="text-lg sm:text-2xl font-black text-amber-400 mt-1">{stats.pending_orders}</div>
            <span className="text-[10px] text-amber-300 font-semibold">Requires approval</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Catalog Inventory</span>
            <div className="text-lg sm:text-2xl font-black text-cyan-400 mt-1">{stats.total_products} Items</div>
            <span className="text-[10px] text-slate-400">{stats.low_stock_products} low stock warnings</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Onboarded Shopkeepers</span>
            <div className="text-lg sm:text-2xl font-black text-purple-400 mt-1">{stats.total_shopkeepers} Labs</div>
            <span className="text-[10px] text-slate-400">{stats.total_admins} Warehouse Admins</span>
          </div>
        </div>
      )}

      {/* Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders' ? 'bg-cyan-400 text-slate-950' : 'glass-card text-slate-300 hover:bg-slate-800'
          }`}
        >
          Spares Orders Queue ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products' ? 'bg-cyan-400 text-slate-950' : 'glass-card text-slate-300 hover:bg-slate-800'
          }`}
        >
          Inventory & Stock ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-cyan-400 text-slate-950' : 'glass-card text-slate-300 hover:bg-slate-800'
          }`}
        >
          Technicians & Lab Accounts ({usersList.length})
        </button>
      </div>

      {/* TAB 1: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Order Approval Queue</h2>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-400">No orders placed yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-mono text-sm font-black text-cyan-400">{order.order_number}</span>
                      <p className="text-xs font-bold text-white mt-0.5">
                        Shop: {order.user?.shop_name || 'Technician Lab'} ({order.user?.full_name})
                      </p>
                      <p className="text-[11px] text-slate-400">Address: {order.shipping_address}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-black text-cyan-400">₹{order.total_amount.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-slate-400 block">{order.total_items} total items</span>
                      </div>

                      {/* Status Change Selector */}
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-slate-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                        <div>
                          <span className="font-bold text-slate-200 block">{item.product_name}</span>
                          <span className="text-[10px] text-slate-400">₹{item.unit_price} x {item.quantity} qty</span>
                        </div>
                        <span className="font-bold text-white">₹{item.subtotal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCT & STOCK MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Catalog Inventory</h2>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-3 py-1.5 bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs"
            >
              + Add Item
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div key={prod.id} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <img src={prod.image_url} alt={prod.name} className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-800" />
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h4>
                    <p className="text-[10px] font-mono text-slate-400">SKU: {prod.sku}</p>
                    <p className="text-[10px] font-bold text-cyan-400 mt-0.5">₹{prod.wholesale_price} / {prod.unit}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <span className={`text-[11px] font-bold ${prod.stock_quantity < 20 ? 'text-red-400' : 'text-emerald-400'}`}>
                    Stock: {prod.stock_quantity}
                  </span>

                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Registered Repair Labs & Technicians</h2>
          <div className="space-y-2">
            {usersList.map((usr) => (
              <div key={usr.id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{usr.full_name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {usr.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{usr.email} • {usr.shop_name || 'No shop name'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Wholesale Component</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Title</label>
                <input
                  required
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. OLED Screen Assembly for iPhone 15 Pro Max"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">SKU Code</label>
                  <input
                    required
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="DSP-IP15PM-SP"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Wholesale Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={productForm.wholesale_price}
                    onChange={(e) => setProductForm({ ...productForm, wholesale_price: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Repair MRP (₹)</label>
                  <input
                    required
                    type="number"
                    value={productForm.retail_mrp}
                    onChange={(e) => setProductForm({ ...productForm, retail_mrp: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Unit Lot</label>
                  <input
                    type="text"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="Box (5 pcs)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">MOQ</label>
                  <input
                    type="number"
                    value={productForm.moq}
                    onChange={(e) => setProductForm({ ...productForm, moq: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm({ ...productForm, stock_quantity: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black rounded-xl text-xs mt-2"
              >
                Save Wholesale Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
