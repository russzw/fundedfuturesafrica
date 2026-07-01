'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, GraduationCap, Search } from 'lucide-react';
import { NavItem } from '../types';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Scholarships', path: '/scholarships' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 darker:bg-black/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 dark:border-slate-700/60 darker:border-zinc-800/60'
          : 'bg-white dark:bg-slate-900 darker:bg-black border-b border-slate-200 dark:border-slate-700 darker:border-zinc-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
            <div className="bg-emerald-600 text-white p-1.5 rounded-lg group-hover:bg-emerald-700 transition-colors duration-200">
              <GraduationCap size={22} />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100 darker:text-zinc-100">
              Funded Futures<span className="text-emerald-600"> Africa</span>
            </span>
          </Link>

          {/* Center Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 darker:text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Search scholarships..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 darker:border-zinc-700 rounded-full bg-slate-50 dark:bg-slate-800 darker:bg-zinc-800 text-sm text-slate-700 dark:text-slate-200 darker:text-zinc-200 placeholder-slate-400 dark:placeholder-slate-500 darker:placeholder-zinc-500 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-700 darker:focus:bg-zinc-700 outline-none transition-all duration-200"
                onFocus={() => router.push('/scholarships')}
                readOnly
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-emerald-700 dark:text-emerald-400 darker:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 darker:bg-emerald-900/20'
                      : 'text-slate-600 dark:text-slate-300 darker:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 darker:hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 darker:bg-zinc-700 mx-2" />
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 darker:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 darker:hover:bg-zinc-800 rounded-lg transition-all duration-200"
            >
              Admin
            </Link>
            <div className="ml-2">
              <ThemeToggle />
            </div>
            <a
              href="mailto:info@fundedfuturesafrica.com"
              className="ml-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] transition-all duration-200"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out origin-top ${
          isOpen ? 'opacity-100 max-h-96 border-b border-slate-200 dark:border-slate-700 darker:border-zinc-800' : 'opacity-0 max-h-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-white/95 dark:bg-slate-900/95 darker:bg-black/95 backdrop-blur-xl">
          {NAV_ITEMS.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            className="block px-4 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Admin
          </Link>
          <a
            href="mailto:info@fundedfuturesafrica.com"
            className="block w-full text-center mt-3 px-4 py-3 bg-emerald-600 text-white rounded-lg text-base font-semibold hover:bg-emerald-700 shadow-md active:scale-[0.98] transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
};
