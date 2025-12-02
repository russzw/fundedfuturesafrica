'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, GraduationCap } from 'lucide-react';
import { NavItem } from '../types';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Scholarships', path: '/scholarships' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
  { label: 'Admin', path: '/admin' }, 
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out transform${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }${
        lastScrollY > 0 ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50' : 'bg-white/95 backdrop-blur-sm border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-brand-600 text-white p-1.5 rounded-lg group-hover:bg-brand-700 transition-colors">
                <GraduationCap size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">
                Funded Futures<span className="text-brand-600"> Africa</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-8">
            {NAV_ITEMS.map((item) => {
                const isActive = router.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 group ${
                            isActive 
                            ? 'text-brand-600' 
                            : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-500'
                        }`}
                    >
                        {item.label}
                        <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-600 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                );
            })}
            <a 
              href="mailto:info@fundedfuturesafrica.com"
              className="ml-4 px-5 py-2.5 bg-brand-600 text-white rounded-full text-sm font-semibold hover:bg-brand-700 hover:shadow-lg active:scale-95 transition-all duration-200 ease-out"
            >
              Contact Us
            </a>
            <ThemeToggle />
          </div>

          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-brand-600 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`md:hidden absolute w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 transition-all duration-300 ease-in-out origin-top ${
          isOpen ? 'opacity-100 scale-y-100 max-h-screen' : 'opacity-0 scale-y-0 max-h-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = router.pathname === item.path;
            return (
                <Link
                    key={item.path}
                    href={item.path}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                        isActive
                        ? 'text-brand-700 bg-brand-50/80 dark:text-brand-500 dark:bg-brand-900/20'
                        : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50/50 dark:text-slate-300 dark:hover:text-brand-500 dark:hover:bg-slate-800/50'
                    }`}
                >
                    {item.label}
                </Link>
            );
            })}
           <a 
            href="mailto:info@fundedfuturesafrica.com"
            className="block w-full text-center mt-6 px-4 py-3 bg-brand-600 text-white rounded-lg text-base font-medium hover:bg-brand-700 shadow-md active:scale-[0.98] transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
};