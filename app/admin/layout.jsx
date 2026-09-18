'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderGit2,
  Cpu,
  BookOpen,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Globe,
  Wrench,
  ShoppingBag,
  Zap,
  History,
  DollarSign,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Markets & Geo', href: '/admin/markets', icon: Globe },
  { name: 'Interactive Tools', href: '/admin/tools', icon: Wrench },
  { name: 'Digital Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Monetization & Ads', href: '/admin/monetization', icon: DollarSign },
  { name: 'Automation Rules', href: '/admin/automation', icon: Zap },
  { name: 'Audit Trail', href: '/admin/audit', icon: History },
  { name: 'Job Applications', href: '/admin/applications', icon: Users },
  { name: 'Careers CMS', href: '/admin/jobs', icon: Briefcase },
  { name: 'Portfolio CMS', href: '/admin/projects', icon: FolderGit2 },
  { name: 'Services CMS', href: '/admin/services', icon: Cpu },
  { name: 'Blog CMS', href: '/admin/blogs', icon: BookOpen },
  { name: 'Inquiries & Leads', href: '/admin/inquiries', icon: Mail },
  { name: 'Settings & Seed', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, don't show the dashboard shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-base tracking-tight text-white">
            Maurya Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile drawer backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        aria-label="Admin navigation"
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-50 transition-[transform,visibility] duration-300 md:translate-x-0 max-md:invisible max-md:data-[open=true]:visible ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-open={mobileMenuOpen}
      >
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-sm text-white leading-tight">
                  Maurya Technologies
                </h2>
                <span className="text-[11px] text-cyan-400 font-medium">Enterprise CMS</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm shadow-cyan-500/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Website
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-950 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
