'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirect = (rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') && !rawRedirect.includes('\\'))
    ? rawRedirect
    : '/admin';

  // Mode: 'login' | 'forgot'
  const [viewMode, setViewMode] = useState('login');

  // Login step: 1 (Email + Password) | 2 (6-digit Master PIN)
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Step 1: Submit email & password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.requireSecurityPin) {
        setStep(2);
      } else {
        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit 6-digit Master PIN
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, securityPin }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Invalid security PIN.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password / PIN submission
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset link.');
      }

      setForgotSuccess(data.message || 'Reset link has been dispatched to your email.');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-100">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
            {viewMode === 'forgot' ? (
              <KeyRound className="w-7 h-7 text-cyan-400" />
            ) : step === 2 ? (
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            ) : (
              <Lock className="w-7 h-7 text-cyan-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            {viewMode === 'forgot'
              ? 'Reset Password & PIN'
              : step === 2
                ? '2-Step Security Verification'
                : 'Maurya Tech Admin Portal'}
          </h1>
          <p className="text-slate-400 text-xs mt-1.5">
            {viewMode === 'forgot'
              ? 'Enter your registered admin email to receive recovery instructions'
              : step === 2
                ? 'Enter your 6-digit Master Security PIN to complete authorization'
                : 'Sign in to manage applications, CMS content & analytics'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </motion.div>
        )}

        {/* Success Alert */}
        {forgotSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{forgotSuccess}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {viewMode === 'forgot' ? (
            /* FORGOT PASSWORD VIEW */
            <motion.form
              key="forgot-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleForgotSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email or Username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Recovery Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('login');
                  setError('');
                  setForgotSuccess('');
                }}
                className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-cyan-400 transition cursor-pointer flex items-center justify-center gap-1.5 pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Admin Login</span>
              </button>
            </motion.form>
          ) : step === 1 ? (
            /* STEP 1: EMAIL & PASSWORD */
            <motion.form
              key="step1-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handlePasswordSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email or Username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('forgot');
                      setError('');
                    }}
                    className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Forgot Password / PIN?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer pt-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Step 2</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            /* STEP 2: 6-DIGIT MASTER SECURITY PIN */
            <motion.form
              key="step2-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handlePinSubmit}
              className="space-y-5"
            >
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <HelpCircle className="w-4 h-4" />
                  <span>6-Digit Master Security PIN Hint</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  💡 <strong>Hint:</strong> Enter your secret 6-digit Master Authorization Code (PIN) configured for your Super Admin account.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Enter 6-Digit PIN
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input
                    type="password"
                    maxLength={6}
                    pattern="\d{6}"
                    required
                    autoFocus
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-emerald-500/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition text-lg tracking-[0.4em] font-mono text-center font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={loading || securityPin.length !== 6}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing Admin Access...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Secure Sign In</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setSecurityPin('');
                      setError('');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('forgot');
                      setError('');
                    }}
                    className="text-xs text-cyan-400 hover:underline cursor-pointer"
                  >
                    Forgot 6-digit PIN?
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-400 transition">
            &larr; Back to Maurya Technologies Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
