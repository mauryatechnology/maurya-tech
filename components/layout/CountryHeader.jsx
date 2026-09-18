'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, ChevronDown, Wrench, BookOpen, Briefcase, ExternalLink, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COUNTRIES = [
  { code: 'in', name: 'India', flag: '🇮🇳', currency: '₹ INR' },
  { code: 'us', name: 'United States', flag: '🇺🇸', currency: '$ USD' },
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', currency: '£ GBP' },
];

function setCountryCookie(newCode) {
  if (typeof document !== 'undefined') {
    document.cookie = `preferred_country=${newCode}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function CountryHeader({ currentCountry = 'in', marketName = 'India' }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeCountry = COUNTRIES.find((c) => c.code === currentCountry) || COUNTRIES[0];

  const handleSwitchCountry = (newCode) => {
    setDropdownOpen(false);
    setCountryCookie(newCode);

    // Replace current country prefix in URL if present
    const segments = pathname.split('/');
    if (segments[1] && ['in', 'us', 'uk'].includes(segments[1])) {
      segments[1] = newCode;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newCode}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href={`/${currentCountry}`} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900/5 p-1 border border-slate-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
              <Image
                src="/logo.png"
                alt="Maurya Technologies Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base text-slate-900 tracking-tight group-hover:text-cyan-600 transition">
                Maurya Technologies
              </span>
              <span className="text-[10px] text-slate-500 font-semibold -mt-0.5 tracking-wider uppercase flex items-center gap-1">
                <span>{activeCountry.flag}</span>
                <span>{activeCountry.name} Hub</span>
              </span>
            </div>
          </Link>

          {/* Nav Links Desktop */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200 text-sm font-medium text-slate-600">
            <Link
              href={`/${currentCountry}/tools`}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                pathname.includes('/tools') ? 'bg-slate-100 text-[#0A2540] font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Wrench className="w-4 h-4 text-cyan-600" />
              Calculators & Tools
            </Link>
            <Link
              href={`/${currentCountry}/guides`}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                pathname.includes('/guides') ? 'bg-slate-100 text-[#0A2540] font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Guides & Resources
            </Link>
            <Link
              href="/careers"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Careers
            </Link>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Country Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition cursor-pointer shadow-xs"
              aria-expanded={dropdownOpen}
              aria-label="Select Country"
            >
              <span className="text-base">{activeCountry.flag}</span>
              <span className="hidden sm:inline">{activeCountry.name}</span>
              <span className="text-[10px] text-slate-500 font-mono hidden md:inline">({activeCountry.currency})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-scale-in">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Country Market
                </div>
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleSwitchCountry(c.code)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                      c.code === currentCountry ? 'bg-cyan-50/70 font-bold text-cyan-900' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-lg">{c.flag}</span>
                      <span>{c.name}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{c.currency}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Agency Bridge Link */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition px-2 py-1"
          >
            Agency Services <ExternalLink className="w-3 h-3" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 md:hidden hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 text-sm font-medium">
          <Link
            href={`/${currentCountry}/tools`}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800"
          >
            Calculators & Tools
          </Link>
          <Link
            href={`/${currentCountry}/guides`}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800"
          >
            Guides & Resources
          </Link>
          <Link
            href="/careers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800"
          >
            Careers & Internships
          </Link>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            Corporate Agency Home
          </Link>
        </div>
      )}
    </header>
  );
}
