"use client";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { advertisements as advertisementData } from '@/data/advertisements';

const AdDialog = ({ ad, onClose, open }) => {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-accent/20">
        <DialogTitle className="sr-only">{ad.content.headline}</DialogTitle>
        <div className={`p-8 ${ad.style.showGradient ? 'bg-gradient-to-br from-primary via-primary to-accent/20' : 'bg-card'}`}>
          {ad.style.showImage && ad.content.imageUrl && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden mb-6 bg-muted">
              <Image
                src={ad.content.imageUrl}
                alt={ad.content.headline || 'Sponsored'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          )}
          <h3 className="text-2xl font-heading font-bold text-foreground mb-3">
            {ad.content.headline}
          </h3>
          <p className="text-muted-foreground mb-6">{ad.content.body}</p>
          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <Link href={ad.content.ctaLink}>{ad.content.ctaText}</Link>
            </Button>
            {ad.content.secondaryCtaText && (
              <Button variant="outline" asChild className="flex-1">
                <Link href={ad.content.secondaryCtaLink || '#'}>{ad.content.secondaryCtaText}</Link>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AdBanner = ({ ad, onClose }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={`relative overflow-hidden ${ad.style.showGradient ? 'bg-gradient-to-r from-accent via-accent/90 to-primary' : 'bg-accent'}`}
    >
      <div className="container-custom py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <p className="text-sm font-medium text-accent-foreground">
            <span className="font-bold">{ad.content.headline}</span>
            <span className="hidden sm:inline"> — {ad.content.body}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="secondary" asChild>
            <Link href={ad.content.ctaLink}>{ad.content.ctaText}</Link>
          </Button>
          {ad.display.showCloseButton && (
            <button onClick={onClose} className="text-accent-foreground/70 hover:text-accent-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AdFloating = ({ ad, onClose }) => {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top': 'top-20 right-4',
    'bottom': 'bottom-4 left-1/2 -translate-x-1/2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed ${positionClasses[ad.display.position]} z-50 w-80 max-w-[calc(100vw-2rem)]`}
    >
      <div className={`rounded-xl shadow-2xl border border-border overflow-hidden ${ad.style.showGradient ? 'bg-gradient-to-br from-card via-card to-accent/10' : 'bg-card'}`}>
        {ad.display.showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="p-5">
          <h4 className="font-heading font-bold text-lg mb-2">{ad.content.headline}</h4>
          <p className="text-sm text-muted-foreground mb-4">{ad.content.body}</p>
          <Button size="sm" className="w-full" asChild>
            <Link href={ad.content.ctaLink}>{ad.content.ctaText}</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const AdvertisementManager = () => {
  const pathname = usePathname();
  const { adsData } = useData();
  const [dismissedAds, setDismissedAds] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('dismissed-ads');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [delayedAds, setDelayedAds] = useState(new Set());

  // Get active advertisements for current page
  const getActiveAds = () => {
    // Priority: context data (editable in admin), then static data
    const currentAdsData = adsData || advertisementData;
    const allAds = currentAdsData.advertisements || [];
    const globalSettings = currentAdsData.globalSettings || { enableAds: true };

    if (!globalSettings.enableAds) return [];

    return allAds.filter((ad) => {
      // Check if active
      if (!ad.schedule?.isActive) return false;

      // Check if dismissed
      if (dismissedAds.has(ad.id)) return false;

      // Check page targeting
      const { mode, selectedPages = [], excludedPages = [] } = ad.targeting || {};

      if (mode === 'homepage' && pathname !== '/') return false;
      if (mode === 'selected' && !selectedPages.includes(pathname)) return false;
      if (mode === 'exclude' && excludedPages.includes(pathname)) return false;
      if (excludedPages.includes(pathname)) return false;

      // Check delay
      if (ad.display?.delayShowSeconds && !delayedAds.has(ad.id)) return false;

      return true;
    });
  };

  // Handle delayed ads
  useEffect(() => {
    const currentAdsData = adsData || advertisementData;
    const allAds = currentAdsData.advertisements || [];

    const timeouts = allAds.map((ad) => {
      if (ad.display?.delayShowSeconds && ad.schedule?.isActive && !dismissedAds.has(ad.id)) {
        return setTimeout(() => {
          setDelayedAds((prev) => new Set([...prev, ad.id]));
        }, ad.display.delayShowSeconds * 1000);
      }
      return null;
    }).filter(Boolean);

    return () => timeouts.forEach(clearTimeout);
  }, [pathname, dismissedAds, adsData]);

  const handleDismiss = (adId) => {
    const newDismissed = new Set([...dismissedAds, adId]);
    setDismissedAds(newDismissed);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dismissed-ads', JSON.stringify([...newDismissed]));
    }
  };

  const activeAds = getActiveAds();
  const dialogAds = activeAds.filter((ad) => ad.display?.type === 'dialog');
  const bannerAds = activeAds.filter((ad) => ad.display?.type === 'banner');
  const floatingAds = activeAds.filter((ad) => ad.display?.type === 'floating');

  return (
    <>
      <AnimatePresence>
        {bannerAds.map((ad) => (
          <AdBanner key={ad.id} ad={ad} onClose={() => handleDismiss(ad.id)} />
        ))}
      </AnimatePresence>

      {dialogAds.map((ad) => (
        <AdDialog
          key={ad.id}
          ad={ad}
          open={!dismissedAds.has(ad.id)}
          onClose={() => handleDismiss(ad.id)}
        />
      ))}

      <AnimatePresence>
        {floatingAds.map((ad) => (
          <AdFloating key={ad.id} ad={ad} onClose={() => handleDismiss(ad.id)} />
        ))}
      </AnimatePresence>
    </>
  );
};

export const Advertisement = AdvertisementManager;
export default AdvertisementManager;
