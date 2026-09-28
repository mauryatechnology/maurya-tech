'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { contacts as contactData } from '@/data/contacts';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Facebook, Instagram, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const footerLinks = {
  solutions: [
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Projects', path: '/projects' },
  ],
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Technologies', path: '/technologies' },
  ],
};

export const Footer = () => {
  const { info } = contactData;
  const { currentTheme, setTheme, mounted } = useTheme();
  const currentYear = new Date().getFullYear();

  const isDarkMode = mounted ? currentTheme?.id === 'engineer-dark' : false;

  return (
    <footer className="mx-4 mb-4 mt-auto">
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border/50 transition-colors duration-300">
        <div className="container-custom py-10 px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Maurya Tech" width={32} height={32} className="w-8 h-8 object-contain" />
                <div>
                  <span className="font-heading font-bold text-lg text-foreground">Maurya</span>
                  <span className="font-heading font-medium text-lg text-accent ml-1">Tech</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-snug max-w-xs">
                Building high-quality digital products, enterprise SaaS, and mobile architectures with our risk-free Pilot Model.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://github.com/kuldeepmaurya4296"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Maurya Tech GitHub"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/maurya-technologies-services"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Maurya Tech LinkedIn"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61587191439669"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Maurya Tech Facebook"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/maurya_tech_services/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Maurya Tech Instagram"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Solutions Links */}
            <div>
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground/90 mb-4">
                Solutions
              </h4>
              <ul className="space-y-2">
                {footerLinks.solutions.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground/90 mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground/90 mb-4">
                Contact
              </h4>
              <div className="space-y-3">
                <a
                  href={`mailto:${info.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-accent" />
                  <span className="truncate">{info.email}</span>
                </a>
                <a
                  href={`tel:${info.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0 text-accent" />
                  <span>{info.phone}</span>
                </a>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
                  <span className="leading-snug">{info.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Theme Switcher */}
        <div className="border-t border-border/40 bg-muted/40 transition-colors">
          <div className="container-custom py-4 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Maurya Technologies & Services. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Contact
              </Link>
            </div>

            {/* Theme Toggle (Light / Dark) */}
            <div className="flex items-center gap-1.5 p-1 bg-background/80 rounded-xl border border-border shadow-xs">
              <button
                onClick={() => setTheme('global-authority')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  !isDarkMode
                    ? 'bg-accent text-accent-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Switch to Industry Standard Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>

              <button
                onClick={() => setTheme('engineer-dark')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isDarkMode
                    ? 'bg-accent text-accent-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Switch to Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
