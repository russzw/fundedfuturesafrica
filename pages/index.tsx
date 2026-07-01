'use client';

import React, { useEffect, useState } from 'react';
import { Search, Loader2, ArrowRight, GraduationCap, Globe, BookOpen, TrendingUp, ChevronDown } from 'lucide-react';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { getScholarships } from '../services/firebase';
import { Scholarship } from '../types';
import Link from 'next/link';

const DEGREE_OPTIONS = ['All Levels', 'High School', 'Bachelors', 'Masters', 'PhD', 'Diploma', 'Fellowship'];
const COUNTRY_OPTIONS = ['All Countries', 'Kenya', 'Nigeria', 'South Africa', 'Ghana', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'Other'];

const HomePage: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('All Levels');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getScholarships();
        const activeScholarships = data.filter(s => !new Date(s.deadline) || new Date(s.deadline) >= new Date());
        setScholarships(activeScholarships);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = scholarships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDegree = selectedDegree === 'All Levels' ||
      (Array.isArray(item.degree) ? item.degree.includes(selectedDegree) : item.degree === selectedDegree);
    const matchesCountry = selectedCountry === 'All Countries' ||
      item.location.toLowerCase().includes(selectedCountry.toLowerCase());
    return matchesSearch && matchesDegree && matchesCountry;
  });

  const featuredScholarships = filteredData.slice(0, 6);

  const stats = [
    { icon: <GraduationCap size={24} />, label: 'Scholarships', value: scholarships.length + '+' },
    { icon: <Globe size={24} />, label: 'Countries', value: '30+' },
    { icon: <BookOpen size={24} />, label: 'Fields of Study', value: '50+' },
    { icon: <TrendingUp size={24} />, label: 'Students Helped', value: '10K+' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 darker:bg-black transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-100">1000+ opportunities available now</span>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
              Find Your{' '}
              <span className="text-amber-400">Funded Future</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-12 leading-relaxed">
              Discover life-changing scholarship opportunities for African students. Your gateway to world-class education starts here.
            </p>

            {/* Advanced Search Bar */}
            <div className="bg-white dark:bg-slate-800 darker:bg-zinc-800 rounded-2xl shadow-2xl p-2 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <select
                    value={selectedDegree}
                    onChange={(e) => setSelectedDegree(e.target.value)}
                    className="w-full appearance-none px-4 py-3.5 bg-slate-50 dark:bg-slate-700 darker:bg-zinc-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 darker:text-zinc-200 focus:ring-2 focus:ring-emerald-600/20 outline-none cursor-pointer"
                  >
                    {DEGREE_OPTIONS.map(degree => (
                      <option key={degree} value={degree}>{degree}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>

                <div className="relative flex-1">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full appearance-none px-4 py-3.5 bg-slate-50 dark:bg-slate-700 darker:bg-zinc-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 darker:text-zinc-200 focus:ring-2 focus:ring-emerald-600/20 outline-none cursor-pointer"
                  >
                    {COUNTRY_OPTIONS.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>

                <div className="relative flex-[2]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by title, provider, or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 darker:bg-zinc-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 darker:text-zinc-200 placeholder-slate-400 focus:ring-2 focus:ring-emerald-600/20 outline-none"
                  />
                </div>

                <Link
                  href={`/scholarships?search=${searchTerm}&degree=${selectedDegree}&country=${selectedCountry}`}
                  className="px-8 py-3.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Search size={18} />
                  <span className="hidden sm:inline">Search</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl text-amber-400 mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-emerald-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-slate-50 dark:fill-slate-900 darker:fill-black transition-colors duration-300"/>
          </svg>
        </div>
      </section>

      {/* Featured Scholarships */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-3">
              Featured Opportunities
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 darker:text-zinc-400 max-w-xl">
              Hand-picked scholarships that are currently open and highly sought-after.
            </p>
          </div>
          <Link
            href="/scholarships"
            className="mt-4 md:mt-0 text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2 transition-colors"
          >
            View All Scholarships
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        ) : featuredScholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredScholarships.map(scholarship => (
              <ScholarshipCard key={scholarship.id} data={scholarship} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-800 darker:bg-zinc-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 darker:border-zinc-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 darker:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" size={24} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No scholarships found matching your criteria.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>

      {/* How It Works */}
      <section className="bg-white dark:bg-slate-800/50 darker:bg-zinc-900/50 py-16 md:py-24 border-y border-slate-200 dark:border-slate-700 darker:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-4">How It Works</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 darker:text-zinc-400 max-w-xl mx-auto">Four simple steps to your global education journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { num: '01', title: 'Discover', desc: 'Browse our extensive, up-to-date list of scholarships.' },
              { num: '02', title: 'Filter', desc: 'Use smart filters to find opportunities that match your profile.' },
              { num: '03', title: 'Prepare', desc: 'Get all the details and links to prepare a winning application.' },
              { num: '04', title: 'Apply', desc: 'Apply directly on the scholarship provider\'s official website.' },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 darker:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-700 darker:border-emerald-800 rounded-2xl mb-5">
                  <span className="font-heading text-xl font-bold text-emerald-600 dark:text-emerald-400">{step.num}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-2">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 darker:text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200 dark:border-slate-600 darker:border-zinc-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="p-10 md:p-14">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
                  Your dream of a world-class education is closer than you think. Explore hundreds of vetted, fully-funded scholarships today.
                </p>
                <Link
                  href="/scholarships"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 text-slate-800 rounded-xl text-base font-bold hover:bg-amber-500 hover:shadow-cta active:scale-[0.98] transition-all duration-200"
                >
                  Find Your Scholarship
                  <ArrowRight size={20} />
                </Link>
              </div>
              <div className="hidden md:block h-full">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1740&auto=format&fit=crop"
                  alt="Graduation"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
