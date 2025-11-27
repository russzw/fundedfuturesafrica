'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, Loader2, ArrowRight } from 'lucide-react';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { getScholarships } from '../services/firebase';
import { Scholarship } from '../types';
import Link from 'next/link';

const HomePage: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDegree, setFilterDegree] = useState('All');

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
    const matchesDegree = filterDegree === 'All' || item.degree.includes(filterDegree);
    return matchesSearch && matchesDegree;
  });

  const featuredScholarships = filteredData.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="bg-sky-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800/40 to-sky-900/60 mix-blend-multiply"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 md:pt-36 md:pb-28 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-200">
            Your Future, Funded.
          </h1>
          <p className="text-lg md:text-xl text-sky-100 max-w-3xl mx-auto mb-10">
            Discover life-changing, fully-funded scholarship opportunities for African students. Your gateway to global education starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/scholarships" className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-600 text-white rounded-full text-base font-semibold hover:bg-brand-700 hover:shadow-lg active:scale-95 transition-all duration-200 ease-out">
                Explore Scholarships <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link suppressHydrationWarning={true} href="#how-it-works" className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-base font-semibold hover:bg-white/20 active:scale-95 transition-all duration-200 ease-out">
                Learn More
            </Link>
          </div>
        </div>
        <div className="absolute -bottom-1/3 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-50 z-10"></div>
      </section>

      {/* Featured Scholarships Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Opportunities</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Handpicked scholarships that are currently popular and highly sought-after.</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-brand-600" size={48} />
          </div>
        ) : featuredScholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredScholarships.map(scholarship => (
              <ScholarshipCard key={scholarship.id} data={scholarship} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">No featured scholarships available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
            <Link href="/scholarships" className="text-brand-600 font-semibold hover:underline flex items-center justify-center gap-2">
                View All Scholarships <ArrowRight size={16} />
            </Link>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20 md:py-28 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Four simple steps to your global education journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12 max-w-5xl mx-auto relative">
             {/* Dashed line connector for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-300 -translate-y-12"></div>
            
            <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white border-2 border-slate-300 rounded-full mb-4 z-10 relative">
                    <span className="text-3xl font-bold text-brand-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Discover</h3>
                <p className="text-slate-500 text-sm">Browse through our extensive, up-to-date list of scholarships.</p>
            </div>
            <div className="text-center relative">
                 <div className="inline-flex items-center justify-center w-24 h-24 bg-white border-2 border-slate-300 rounded-full mb-4 z-10 relative">
                    <span className="text-3xl font-bold text-brand-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Filter</h3>
                <p className="text-slate-500 text-sm">Use smart filters to narrow down choices based on your profile and interests.</p>
            </div>
            <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white border-2 border-slate-300 rounded-full mb-4 z-10 relative">
                    <span className="text-3xl font-bold text-brand-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Prepare</h3>
                <p className="text-slate-500 text-sm">Get all the details and links you need to prepare a winning application.</p>
            </div>
            <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white border-2 border-slate-300 rounded-full mb-4 z-10 relative">
                    <span className="text-3xl font-bold text-brand-600">4</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Apply</h3>
                <p className="text-slate-500 text-sm">Confidently apply directly on the scholarship provider's official website.</p>
            </div>
          </div>
        </div>
      </section>

        {/* CTA Section */}
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <div className="bg-gradient-to-br from-brand-600 to-sky-700 text-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                        <div className="p-10 md:p-12">
                           <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                           <p className="text-lg text-sky-100 mb-8">Your dream of a world-class education is closer than you think. Explore hundreds of vetted, fully-funded scholarships and take the next step towards a brighter future.</p>
                           <Link href="/scholarships" className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-sky-800 rounded-full text-base font-semibold hover:bg-slate-100 hover:shadow-lg active:scale-95 transition-all duration-200 ease-out">
                                Find Your Scholarship <ArrowRight size={20} className="ml-2" />
                           </Link>
                        </div>
                        <div className="hidden md:block h-full">
                            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1740&auto=format&fit=crop" alt="Graduation" className="h-full w-full object-cover"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
};

export default HomePage;
