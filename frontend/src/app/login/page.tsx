'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Store, Key, Mail, ShieldCheck, AlertCircle, ArrowRight, Lock, User, MapPin, Phone, Building } from 'lucide-react';

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
        await register({
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
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-emerald-400 to-indigo-500 flex items-center justify-center mx-auto text-slate-950 font-black text-2xl shadow-lg shadow-cyan-400/20">
            S
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">SAASHA B2B Wholesale</h1>
          <p className="text-xs text-slate-400">
            {mode === 'login' ? 'Sign in to access wholesale catalog & orders' : 'Register your repair shop or retail business'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              mode === 'login' ? 'bg-cyan-400 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              mode === 'register' ? 'bg-cyan-400 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Business
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3.5 rounded-2xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-cyan-400" /> Shop / Business Name *
                </label>
                <input
                  required
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Rahul Mobile Repair & Service Lab"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address *
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@business.com"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password *
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" /> Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Shop Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shop #12, Central Market, City"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-cyan-400/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {submitting
              ? 'Authenticating...'
              : mode === 'login'
              ? 'Sign In to Account'
              : 'Complete Business Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-slate-400">Loading authentication...</div>}>
      <LoginContent />
    </Suspense>
  );
}
