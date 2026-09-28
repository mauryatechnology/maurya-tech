'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowRight, Sparkles, Share2, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AdvertisementDialog = () => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const router = useRouter();

  useEffect(() => {
    // Never interrupt mobile visitors, and show at most once per session.
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(max-width: 1023px)').matches) return undefined;
    try {
      if (sessionStorage.getItem('promo-dialog-shown')) return undefined;
    } catch {
      // storage unavailable — fall through and show once
    }

    const openTimer = setTimeout(() => {
      setOpen(true);
      setTimeLeft(5);
      try {
        sessionStorage.setItem('promo-dialog-shown', '1');
      } catch {}
    }, 10000);

    return () => clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    if (!open) return;

    // 2. Countdown timer for 5 seconds
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 3. Auto-close dialog after 5 seconds
    const closeTimer = setTimeout(() => {
      setOpen(false);
    }, 5000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(closeTimer);
    };
  }, [open]);

  const handleContact = () => {
    setOpen(false);
    router.push('/contact');
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://maurya-tech.com';
    const shareData = {
      title: 'Maurya Tech Exclusive Pilot Offer!',
      text: '🚀 Get up to 60% OFF on Software Services & Start Your Risk-Free Pilot with Maurya Tech:',
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast.success('Special offer link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border border-accent/30 shadow-2xl p-6 rounded-3xl overflow-hidden">
        {/* Top Progress Bar for 5s Duration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-muted overflow-hidden">
          <div
            className="h-full bg-accent transition-all ease-linear"
            style={{
              width: `${(timeLeft / 5) * 100}%`,
              transitionDuration: '1000ms',
            }}
          />
        </div>

        <DialogHeader className="pt-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited Time Offer</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-accent" />
              <span>Closes in {timeLeft}s</span>
            </div>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-heading font-extrabold text-foreground mt-3">
            Build Risk-Free With Our{' '}
            <span className="bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">
              Pilot Model
            </span>
          </DialogTitle>

          <DialogDescription asChild className="text-sm mt-2">
            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-background rounded-2xl border border-border flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-foreground text-sm">Up to 60% OFF</div>
                  <div className="text-xs text-muted-foreground">On Custom Web & Mobile App Pilots</div>
                </div>
                <span className="text-xs font-bold text-accent px-2.5 py-1 rounded-lg bg-accent/10">
                  Save 60%
                </span>
              </div>

              <div className="p-3.5 bg-background rounded-2xl border border-border flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-foreground text-sm">30% Commission Share</div>
                  <div className="text-xs text-muted-foreground">For Referral & B2B Sales Partners</div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10">
                  Partnership
                </span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5 pt-4">
          <Button
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs py-5 rounded-xl shadow-lg shadow-accent/20 cursor-pointer"
            onClick={handleContact}
          >
            <span>Claim Offer & Start Risk-Free Pilot</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs font-semibold border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl"
              asChild
            >
              <a href="https://wa.me/916263638053" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                WhatsApp
              </a>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs font-semibold border-border rounded-xl"
              onClick={handleShare}
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertisementDialog;
