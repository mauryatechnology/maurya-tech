'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ShieldCheck, Download, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function CheckoutModal({
  isOpen,
  onClose,
  product = {
    sku: 'resume-pack-2026',
    title: '2026 ATS-Optimized Tech Resume & Salary Negotiation Kit',
    priceDisplay: '₹199',
    features: [
      '5 ATS-compliant Resume Templates (Word, PDF, LaTeX)',
      '50+ High-Impact bullet point formulas for tech roles',
      'Salary negotiation cheat sheets & email counter-scripts',
      'Instant digital download with free lifetime updates',
    ],
  },
  country = 'IN',
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order
      const checkoutRes = await fetch('/api/products/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: product.sku,
          email,
          name,
          phone,
          country,
        }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error || 'Failed to initiate checkout.');
      }

      const { orderId, isDemoMode, keyId, amount, currency } = checkoutData;

      // 2. Handle payment (Razorpay vs Demo Mode)
      if (isDemoMode) {
        // Immediate sandbox verification
        const verifyRes = await fetch('/api/products/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            paymentId: `pay_demo_${Date.now()}`,
            signature: 'demo_signature',
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          throw new Error(verifyData.error || 'Payment verification failed.');
        }

        setDownloadUrl(verifyData.downloadUrl);
        setPurchased(true);
        toast.success('Payment verified! Your download is ready.');
      } else {
        // Live Razorpay Checkout
        if (!window.Razorpay) {
          setLoading(false);
          toast.error('Payment gateway is still loading. Please try again in a moment.');
          return;
        }

        const options = {
          key: keyId,
          amount,
          currency,
          name: 'Maurya Technologies',
          description: product.title,
          order_id: orderId,
          prefill: {
            name,
            email,
            contact: phone,
          },
          theme: {
            color: '#0A2540',
          },
          handler: async function (response) {
            try {
              const verifyRes = await fetch('/api/products/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok) {
                setDownloadUrl(verifyData.downloadUrl);
                setPurchased(true);
                toast.success('Payment successful! Download ready.');
              } else {
                toast.error('Verification failed. Please contact support.');
              }
            } catch {
              toast.error('Error verifying payment.');
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Something went wrong during checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPurchased(false);
    setDownloadUrl('');
    setName('');
    setEmail('');
    setPhone('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="sm:max-w-md bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-[11px] font-bold text-cyan-800 w-fit">
            <Sparkles className="w-3 h-3 text-cyan-600" />
            <span>Official Digital Asset</span>
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {product.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Instant digital delivery to your inbox with lifetime updates.
          </DialogDescription>
        </DialogHeader>

        {purchased ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Thank You For Your Order!</h3>
              <p className="text-xs text-slate-600">
                A confirmation receipt with your permanent download link has also been sent to <strong>{email}</strong>.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={downloadUrl}
                download
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-md transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Assets Now</span>
              </a>
            </div>

            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Close Window
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-4 pt-2">
            {/* Features list */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700">Included in this kit:</div>
              <ul className="text-xs text-slate-600 space-y-1.5">
                {(product.features || []).map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="cust-name" className="text-xs font-semibold text-slate-700">
                  Full Name
                </Label>
                <Input
                  id="cust-name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 bg-white border-slate-200 text-slate-900 text-xs rounded-xl focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cust-email" className="text-xs font-semibold text-slate-700">
                  Email Address (for instant download link)
                </Label>
                <Input
                  id="cust-email"
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-white border-slate-200 text-slate-900 text-xs rounded-xl focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cust-phone" className="text-xs font-semibold text-slate-700">
                  Mobile Number (Optional)
                </Label>
                <Input
                  id="cust-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 bg-white border-slate-200 text-slate-900 text-xs rounded-xl focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Price & Submit */}
            <div className="pt-2 space-y-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Get Instant Access for {product.priceDisplay || '₹199'}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL Secure Checkout • 100% Satisfaction Guarantee</span>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
