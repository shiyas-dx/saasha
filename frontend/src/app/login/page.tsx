'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Store, Key, Mail, Crown, ShieldCheck, AlertCircle } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const loggedUser = await login(email, password);
        if (loggedUser.role === 'SUPERADMIN' || loggedUser.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push(redirectPath);
        }
      } else {
        const registeredUser = await register({
          email,
          password,
          full_name: fullName,
          shop_name: shopName,
          phone,
          address,
          role: 'SHOPKEEPER',
        });
        router.push(redirectPath);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPw: string) => {
    setEmail(demoEmail);
    setPassword(demoPw);
    setMode('login');
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center mx-auto text-white font-black text-2xl shadow-lg shadow-brand-500/20">
            S
          </div>
          <h1 className="text-xl font-black text-white">SAASHA Wholesale Market</h1>
          <p className="text-xs text-slate-400">Login to access supplier wholesale rates & orders</p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fillDemo('superadmin@saasha.com', 'superadmin123')}
              className="col-span-2 px-2.5 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 text-[11px] font-bold text-left flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 text-purple-400" /> Superadmin Owner (`superadmin@saasha.com`)
            </button>

            <button
              onClick={() => fillDemo('admin@saasha.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 text-[11px] font-bold text-left flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Admin #1
            </button>

            <button
              onClick={() => fillDemo('admin2@saasha.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 text-[11px] font-bold text-left flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Admin #2
            </button>

            <button
              onClick={() => fillDemo('shopkeeper@saasha.com', 'shop123')}
              className="col-span-2 px-2.5 py-1.5 rounded-xl bg-brand-500/10 text-brand-300 border border-brand-500/30 hover:bg-brand-500/20 text-[11px] font-bold text-left flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5 text-brand-400" /> Shopkeeper Demo (Rahul Express Mart)
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Shopkeeper
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Retail Shop / Business Name *</label>
                <input
                  required
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Ramesh Super Traders"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="shopkeeper@saasha.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Password *</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Shop Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shop #4, Main Market, City"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-brand-600/30 disabled:opacity-50"
          >
            {submitting
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In to SAASHA'
              : 'Create Shopkeeper Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-slate-400">Loading auth...</div>}>
      <LoginContent />
    </Suspense>
  );
}
