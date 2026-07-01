'use client';

import { Shield, Target, Users, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  const values = [
    { icon: <Target size={28} />, title: 'Our Mission', description: 'To bridge the information gap and connect African students with transformative scholarship opportunities that enable them to achieve their full potential.' },
    { icon: <Shield size={28} />, title: 'Our Vision', description: 'A future where every talented and driven African student has the resources to pursue higher education, regardless of their financial background.' },
    { icon: <Users size={28} />, title: 'Who We Are', description: 'We are a passionate team of educators, technologists, and community builders dedicated to creating a centralized hub for scholarships available to Africans.' },
  ];

  const impact = [
    { value: '10K+', label: 'Students Reached' },
    { value: '500+', label: 'Scholarships Listed' },
    { value: '30+', label: 'Countries Covered' },
    { value: '50+', label: 'Fields of Study' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 darker:bg-black transition-colors duration-300">
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-800 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">About Funded Futures Africa</h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">Empowering the next generation of African leaders through accessible education and opportunities.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 darker:bg-zinc-950 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 darker:border-zinc-800 shadow-card hover:shadow-card-hover transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 darker:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-6">{item.icon}</div>
              <h2 className="font-heading text-xl font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-4">{item.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 darker:text-zinc-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800/50 darker:bg-zinc-950/50 py-20 border-y border-slate-200 dark:border-slate-700 darker:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-4">Our Impact</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 darker:text-zinc-400 max-w-xl mx-auto">Making a difference in the lives of African students.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impact.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-heading text-4xl md:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 darker:text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white dark:bg-slate-800 darker:bg-zinc-950 rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 darker:border-zinc-800 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 darker:bg-amber-900/20 rounded-xl flex items-center justify-center"><Heart className="text-amber-600 dark:text-amber-400" size={24} /></div>
            <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">Our Story</h2>
          </div>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 darker:text-zinc-300 leading-relaxed">
            <p>Funded Futures Africa was born from a simple observation: too many talented African students miss out on life-changing scholarship opportunities simply because the information is scattered, hard to find, or behind paywalls.</p>
            <p>We believe that access to information should never be a barrier to education. That&apos;s why we&apos;ve created a free, comprehensive, and always up-to-date platform that aggregates scholarship opportunities from across the globe specifically for African students.</p>
            <p>Our team manually reviews and verifies every scholarship listing to ensure accuracy and legitimacy. We work directly with universities, foundations, and government bodies to bring you the most current and relevant opportunities.</p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-3xl p-10 md:p-14 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Scholarship?</h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">Start exploring hundreds of opportunities tailored for African students.</p>
            <Link href="/scholarships" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-slate-800 rounded-xl font-bold hover:bg-amber-500 hover:shadow-cta active:scale-[0.98] transition-all duration-200">
              Browse Scholarships <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
