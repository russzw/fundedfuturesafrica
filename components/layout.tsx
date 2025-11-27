import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/scholarships', label: 'Scholarships' },
    { href: '/about', label: 'About' },
    { href: '/admin', label: 'Admin' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-30 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-brand-700 hover:text-brand-800 transition-colors">
                Funded Futures Africa
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-all">
                      {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-slate-100 inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-800 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-brand-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? <Menu size={24}/> : <X size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-all">
                    {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-slate-100 border-t border-slate-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} Funded Futures Africa. All rights reserved.</p>
              <p className="mt-2">
                  Built by <a href="https://devruss.me" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">dev🔥russ</a>
              </p>
          </div>
      </footer>
    </div>
  );
};

export default Layout;
