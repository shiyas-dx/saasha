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
  UserPlus,
  CheckCircle2,
  X,
  Building,
  Mail,
  Lock,
  Truck
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

  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);

  // Tracking Dispatch Update Modal
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<any>(null);
  const [dispatchForm, setDispatchForm] = useState({
    status: 'SHIPPED',
    tracking_number: '',
    courier_name: 'BlueDart B2B',
    estimated_delivery: '',
  });

  // Product Form
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

  // Create Admin Form
  const [adminForm, setAdminForm] = useState({
    full_name: '',
    email: '',
    password: '',
    shop_name: 'SAASHA Warehouse Ops',
    phone: '',
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

  const handleOpenDispatchModal = (order: any) => {
    setSelectedOrderForDispatch(order);
    setDispatchForm({
      status: order.status || 'SHIPPED',
      tracking_number: order.tracking_number || `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      courier_name: order.courier_name || 'BlueDart B2B',
      estimated_delivery: order.estimated_delivery || '28 Sep 2026',
    });
  };

  const handleSaveDispatchTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDispatch) return;

    try {
      await fetchApi(`/admin/orders/${selectedOrderForDispatch.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(dispatchForm),
      });
      setSelectedOrderForDispatch(null);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update tracking');
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

  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...adminForm,
          role: 'ADMIN',
        }),
      });
      setShowCreateAdminModal(false);
      setAdminForm({ full_name: '', email: '', password: '', shop_name: 'SAASHA Warehouse Ops', phone: '' });
      loadAdminData();
      alert('New Management Admin user created successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to create management admin user');
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
    return <div className="text-center py-20 text-slate-500 font-bold">Loading Management Console...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mb-1">
            {isSuperAdmin ? <Crown className="w-3.5 h-3.5 text-purple-600" /> : <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
            {isSuperAdmin ? 'Superadmin Master Desk' : 'Warehouse Management Desk'}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">SAASHA Spares Control Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: <strong className="text-blue-600">{user?.full_name}</strong> ({user?.role})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <button
              onClick={() => setShowCreateAdminModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Add Admin User
            </button>
          )}

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Wholesale Item
          </button>
        </div>
      </div>

      {/* Overview Stats Cards Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Revenue</span>
            <div className="text-lg sm:text-2xl font-black text-emerald-600 mt-1">₹{stats.total_revenue.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-slate-500">All fulfilled orders</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending Orders</span>
            <div className="text-lg sm:text-2xl font-black text-amber-600 mt-1">{stats.pending_orders}</div>
            <span className="text-[10px] text-amber-600 font-bold">Requires approval</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Catalog Inventory</span>
            <div className="text-lg sm:text-2xl font-black text-blue-600 mt-1">{stats.total_products} Items</div>
            <span className="text-[10px] text-slate-500">{stats.low_stock_products} low stock warnings</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">System Accounts</span>
            <div className="text-lg sm:text-2xl font-black text-purple-600 mt-1">
              {stats.total_admins} Admins • {stats.total_shopkeepers} Labs
            </div>
            <span className="text-[10px] text-slate-500">Active accounts</span>
          </div>
        </div>
      )}

      {/* Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Spares Orders Queue ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Inventory & Stock ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Registered Accounts ({usersList.length})
        </button>
      </div>

      {/* TAB 1: ORDER MANAGEMENT & DISPATCH TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Order Approval & Tracking Desk</h2>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-500">No orders placed yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <span className="font-mono text-sm font-black text-blue-600">{order.order_number}</span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">
                        Shop: {order.user?.shop_name || 'Technician Lab'} ({order.user?.full_name})
                      </p>
                      <p className="text-[11px] text-slate-500">Address: {order.shipping_address}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900">₹{order.total_amount.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-slate-500 block">{order.total_items} total items</span>
                      </div>

                      <button
                        onClick={() => handleOpenDispatchModal(order)}
                        className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4 text-blue-600" /> Dispatch Info ({order.status})
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">{item.product_name}</span>
                          <span className="text-[10px] text-slate-500">₹{item.unit_price} x {item.quantity} qty</span>
                        </div>
                        <span className="font-bold text-blue-600">₹{item.subtotal}</span>
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
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Catalog Inventory</h2>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
            >
              + Add Item
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <img src={prod.image_url} alt={prod.name} className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-200" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                    <p className="text-[10px] font-mono text-slate-500">SKU: {prod.sku}</p>
                    <p className="text-[10px] font-bold text-blue-600 mt-0.5">₹{prod.wholesale_price} / {prod.unit}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className={`text-[11px] font-bold ${prod.stock_quantity < 20 ? 'text-red-600' : 'text-emerald-600'}`}>
                    Stock: {prod.stock_quantity}
                  </span>

                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Registered Accounts</h2>
            {isSuperAdmin && (
              <button
                onClick={() => setShowCreateAdminModal(true)}
                className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Create Admin User
              </button>
            )}
          </div>

          <div className="space-y-2">
            {usersList.map((usr) => (
              <div key={usr.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{usr.full_name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      usr.role === 'SUPERADMIN'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : usr.role === 'ADMIN'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {usr.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{usr.email} • {usr.shop_name || 'No shop name'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISPATCH & TRACKING UPDATE MODAL */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" /> Dispatch & Tracking Details
              </h3>
              <button onClick={() => setSelectedOrderForDispatch(null)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDispatchTracking} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Order Status *</label>
                <select
                  value={dispatchForm.status}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                >
                  <option value="APPROVED">APPROVED (Stock Reserved)</option>
                  <option value="PROCESSING">PROCESSING (Boxed in Warehouse)</option>
                  <option value="SHIPPED">SHIPPED (In Transit with Carrier)</option>
                  <option value="DELIVERED">DELIVERED (Fulfilled at Shop)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Courier Carrier Name</label>
                <input
                  type="text"
                  value={dispatchForm.courier_name}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, courier_name: e.target.value })}
                  placeholder="e.g. BlueDart B2B / Delhivery Express"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tracking Number / AWB Code</label>
                <input
                  type="text"
                  value={dispatchForm.tracking_number}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, tracking_number: e.target.value })}
                  placeholder="e.g. TRK-88992211"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Estimated Arrival Date</label>
                <input
                  type="text"
                  value={dispatchForm.estimated_delivery}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, estimated_delivery: e.target.value })}
                  placeholder="e.g. 28 Sep 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs mt-2 shadow-md shadow-blue-600/20"
              >
                Save Dispatch Tracking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ADMIN USER MODAL */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600" /> Create Management Admin User
              </h3>
              <button onClick={() => setShowCreateAdminModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Full Name *</label>
                <input
                  required
                  type="text"
                  value={adminForm.full_name}
                  onChange={(e) => setAdminForm({ ...adminForm, full_name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Email Address *</label>
                <input
                  required
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  placeholder="admin.name@saasha.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password *</label>
                <input
                  required
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl text-xs mt-2 shadow-md shadow-purple-600/20"
              >
                Create Admin Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-3xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Wholesale Component</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Title</label>
                <input
                  required
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. OLED Screen Assembly for iPhone 15 Pro Max"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">SKU Code</label>
                  <input
                    required
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="DSP-IP15PM-SP"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Wholesale Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={productForm.wholesale_price}
                    onChange={(e) => setProductForm({ ...productForm, wholesale_price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Repair MRP (₹)</label>
                  <input
                    required
                    type="number"
                    value={productForm.retail_mrp}
                    onChange={(e) => setProductForm({ ...productForm, retail_mrp: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit Lot</label>
                  <input
                    type="text"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="Box (5 pcs)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">MOQ</label>
                  <input
                    type="number"
                    value={productForm.moq}
                    onChange={(e) => setProductForm({ ...productForm, moq: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm({ ...productForm, stock_quantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs mt-2 shadow-md shadow-blue-600/20"
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
