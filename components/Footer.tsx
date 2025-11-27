import React from 'react';
import { Mail, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="text-brand-500" size={24} />
              <span className="font-bold text-xl text-white">
                Funded Futures<span className="text-brand-500"> Africa</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              To expand access to world-class education for African students by making scholarship information clear, reliable, and easy to navigate.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#/" className="hover:text-brand-500 transition-colors">Home</a></li>
              <li><a href="#/scholarships" className="hover:text-brand-500 transition-colors">Find Scholarships</a></li>
              <li><a href="#/about" className="hover:text-brand-500 transition-colors">About Us</a></li>
              <li><a href="#/admin" className="hover:text-brand-500 transition-colors">Admin Login</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors mb-2">
              <Mail size={18} />
              <a href="mailto:info@fundedfuturesafrica.com" className="text-sm">
                info@fundedfuturesafrica.com
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              © {new Date().getFullYear()} Funded Futures Africa. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};