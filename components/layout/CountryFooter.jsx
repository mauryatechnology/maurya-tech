import React from 'react';
import Link from 'next/link';
import { Wrench, ShieldCheck, Zap, Globe2 } from 'lucide-react';

export function CountryFooter({ currentCountry = 'in', marketName = 'India' }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0A2540] to-[#00D4FF] flex items-center justify-center text-white font-bold text-sm">
                M
              </span>
              <span className="font-bold text-sm text-white tracking-tight">
                Maurya-Tech {marketName}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Fast, privacy-first financial, salary, career, and productivity calculation utilities tailored for {marketName}. 100% free with zero backend data storage.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Client-side computation &bull; Private & Secure
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider mb-3">
              Popular Calculators
            </h4>
            <ul className="space-y-2">
              {currentCountry === 'in' ? (
                <>
                  <li>
                    <Link href="/in/tools/ctc-calculator" className="hover:text-cyan-400 transition">
                      CTC to In-Hand Salary Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/in/tools/emi-calculator" className="hover:text-cyan-400 transition">
                      Loan & Home EMI Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools/percentage-calculator" className="hover:text-cyan-400 transition">
                      Percentage & Discount Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools/age-calculator" className="hover:text-cyan-400 transition">
                      Exact Age & Birthday Calculator
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href={`/${currentCountry}/tools/hourly-to-annual-salary`} className="hover:text-cyan-400 transition">
                      Hourly to Annual Wage Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools/percentage-calculator" className="hover:text-cyan-400 transition">
                      Percentage Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools/age-calculator" className="hover:text-cyan-400 transition">
                      Age & Date Difference Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${currentCountry}/tools/ctc-calculator`} className="hover:text-cyan-400 transition">
                      Gross to Net Take-Home Pay
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Regional Hubs */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider mb-3">
              Global Platform Hubs
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/in" className="hover:text-white transition flex items-center gap-1.5">
                  <span>🇮🇳</span> India Hub (INR)
                </Link>
              </li>
              <li>
                <Link href="/us" className="hover:text-white transition flex items-center gap-1.5">
                  <span>🇺🇸</span> United States Hub (USD)
                </Link>
              </li>
              <li>
                <Link href="/uk" className="hover:text-white transition flex items-center gap-1.5">
                  <span>🇬🇧</span> United Kingdom Hub (GBP)
                </Link>
              </li>
              <li className="pt-1 text-[10px] text-slate-500 flex items-center gap-1">
                <Globe2 className="w-3 h-3" /> More countries launching soon
              </li>
            </ul>
          </div>

          {/* Corporate & Legal */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider mb-3">
              Maurya Technologies
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Maurya Technologies
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Custom Software Development
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Careers & Hiring
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href={`/${currentCountry}/salary`} className="hover:text-white transition">
                  Salary breakdowns
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-white transition">
                  How we calculate
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy & Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {year} Maurya Technologies & Services. All calculation results are for informational purposes only.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/contact" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
