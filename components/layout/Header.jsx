"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Consolidated navigation structure - Industry standard 6 main items
const navItems = [
  { name: 'Home', path: '/' },
  {
    name: 'Solutions',
    children: [
      { name: 'Services', path: '/services', description: 'Custom development & consulting' },
      { name: 'Products', path: '/products', description: 'Ready-to-deploy solutions' },
      { name: 'Technologies', path: '/technologies', description: 'Our tech expertise' },
    ]
  },
  { name: 'Projects', path: '/projects' },
  { name: 'Pricing', path: '/pricing' },
  {
    name: 'Company',
    children: [
      { name: 'About Us', path: '/about', description: 'Our story & mission' },
      { name: 'Careers', path: '/careers', description: 'Join our team' },
      { name: 'Blog', path: '/blog', description: 'Insights & updates' },
    ]
  },
  { name: 'Contact', path: '/contact' },
];

// Dropdown Component
const NavDropdown = ({ item, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const menuId = `nav-menu-${item.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  // Clear the close timer on unmount so it cannot fire against a gone component.
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Keyboard and screen-reader users never trigger mouseenter, so the menu
      // also opens on focus and closes on Escape or focus leaving the group.
      onFocus={handleMouseEnter}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setIsOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          'px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-1',
          isActive
            ? 'text-accent bg-accent/5'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        )}
      >
        {item.name}
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            id={menuId}
            className="absolute top-full left-0 pt-2 z-50"
          >
            <div className="w-64 bg-card rounded-xl border border-border shadow-xl overflow-hidden">
              <div className="p-2">
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    href={child.path}
                    className="block p-3 rounded-lg hover:bg-muted transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-medium text-sm group-hover:text-accent transition-colors">
                      {child.name}
                    </div>
                    {child.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {child.description}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState(null);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    queueMicrotask(() => {
      setIsOpen(false);
      setExpandedMobile(null);
    });
  }, [pathname]);

  // The previous scroll position and the menu state live in refs, not state:
  // keeping them in the effect's dependency array made every scroll frame tear
  // down and re-attach the listener.
  const lastScrollY = useRef(0);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Add background when scrolled past 20px
        setScrolled(currentScrollY > 20);

        // Hide/show navbar based on scroll direction
        if (!isOpenRef.current) {
          if (currentScrollY < 80) {
            setIsHidden(false);
          } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsHidden(true);
          } else if (currentScrollY < lastScrollY.current) {
            setIsHidden(false);
          }
        }

        lastScrollY.current = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Check if any child path is active
  const isItemActive = (item) => {
    if (item.path) return pathname === item.path;
    if (item.children) {
      return item.children.some(child => pathname === child.path);
    }
    return false;
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
          isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
          scrolled
            ? 'bg-navbar/95 backdrop-blur-md shadow-lg border-b border-navbar-border'
            : 'bg-transparent'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Maurya Tech" width={40} height={40} priority className="w-10 h-10 object-contain" />
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-lg text-foreground">Maurya</span>
                <span className="font-heading font-medium text-lg text-muted-foreground ml-1">Tech</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                item.children ? (
                  <NavDropdown
                    key={item.name}
                    item={item}
                    isActive={isItemActive(item)}
                  />
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      'px-4 py-2 rounded-md font-medium text-sm transition-colors',
                      pathname === item.path
                        ? 'text-accent bg-accent/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/contact">
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Start Pilot
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop & Drawer - Portalled to Body */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 z-[99] lg:hidden"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-navbar border-l border-navbar-border z-[100] lg:hidden overflow-y-auto shadow-2xl"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className="font-heading font-semibold">Menu</span>
                    <button
                      className="p-2 rounded-md hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <nav className="flex-1 p-4 flex flex-col gap-1">
                    {navItems.map((item) => (
                      item.children ? (
                        <div key={item.name} className="mb-2">
                          <button
                            onClick={() => setExpandedMobile(expandedMobile === item.name ? null : item.name)}
                            className={cn(
                              'w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors',
                              isItemActive(item)
                                ? 'text-accent bg-accent/5'
                                : 'text-foreground hover:bg-muted'
                            )}
                          >
                            {item.name}
                            <ChevronDown className={cn(
                              "w-5 h-5 transition-transform duration-200",
                              expandedMobile === item.name && "rotate-180"
                            )} />
                          </button>

                          <AnimatePresence>
                            {expandedMobile === item.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 mt-1 space-y-1">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.path}
                                      href={child.path}
                                      onClick={() => setIsOpen(false)}
                                      className={cn(
                                        'block px-4 py-2 rounded-lg text-sm transition-colors',
                                        pathname === child.path
                                          ? 'text-accent bg-accent/5'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                      )}
                                    >
                                      {child.name}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'px-4 py-3 rounded-lg font-medium transition-colors',
                            pathname === item.path
                              ? 'text-accent bg-accent/5'
                              : 'text-foreground hover:bg-muted'
                          )}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}

                    <div className="mt-6 pt-6 border-t border-border">
                      <Link href="/contact" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                          Start Your Pilot
                        </Button>
                      </Link>
                    </div>
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
