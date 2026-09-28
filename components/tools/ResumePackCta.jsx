'use client';

import React, { useState } from 'react';
import { CheckoutModal } from '@/components/products/CheckoutModal';

/** Opens the real Razorpay checkout for the ₹199 resume/salary pack. */
export function ResumePackCta({ label = 'Get the Pack', country = 'in', priceDisplay = '₹199' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="pt-1 flex items-center justify-between gap-3">
        <span className="text-xs font-extrabold text-slate-900">Only {priceDisplay}</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
        >
          {label}
        </button>
      </div>
      <CheckoutModal isOpen={open} onClose={() => setOpen(false)} country={(country || 'in').toUpperCase()} />
    </>
  );
}
