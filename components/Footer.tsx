import React from 'react';
import Link from 'next/link';
import { Mail, GraduationCap, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 darker:bg-black text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
                <GraduationCap size={22} />
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Funded Futures<span className="text-emerald-400"> Africa</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Expanding access to world-class education for African students by making scholarship information clear, reliable, and easy to navigate.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors duration-200">Home</Link></li>
              <li><Link href="/scholarships" className="hover:text-emerald-400 transition-colors duration-200">Find Scholarships</Link></li>
              <li><Link href="/resources" className="hover:text-emerald-400 transition-colors duration-200">Resources</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors duration-200">About Us</Link></li>
              <li><Link href="/admin" className="hover:text-emerald-400 transition-colors duration-200">Admin Login</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/resources" className="hover:text-emerald-400 transition-colors duration-200">Application Tips</Link></li>
              <li><Link href="/resources" className="hover:text-emerald-400 transition-colors duration-200">Interview Prep</Link></li>
              <li><Link href="/resources" className="hover:text-emerald-400 transition-colors duration-200">Application Checklist</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <div className="space-y-3 text-sm">
              <a href="mailto:info@fundedfuturesafrica.com" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                <Mail size={16} className="flex-shrink-0" />
                info@fundedfuturesafrica.com
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={16} className="flex-shrink-0" />
                <span>Africa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Funded Futures Africa. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built by <a href="https://www.devruss.site/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">devruss</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
