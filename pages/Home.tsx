import React, { useEffect, useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { getScholarships } from '../services/firebase';
import { Scholarship } from '../types';

export const Home: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDegree, setFilterDegree] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getScholarships();
        setScholarships(data);
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-sky-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 to-sky-900/50 mix-blend-multiply"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Empowering Africa's <br className="hidden md:block"/>Next Generation of Leaders
          </h1>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto mb-10">
            Find reliable, fully-funded scholarship opportunities tailored for African students pursuing global education.
          </p>
          <div className="max-w-md mx-auto relative">
             <input 
              type="text" 
              placeholder="Search by keyword, country, or provider..." 
              className="w-full py-4 pl-12 pr-4 rounded-full text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Filter size={20} className="text-brand-600" />
            <span>Available Opportunities</span>
            <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full">{filteredData.length}</span>
          </div>
          <div className="flex gap-2">
             {['All', 'Bachelors', 'Masters', 'PhD'].map(deg => (
               <button
                key={deg}
                onClick={() => setFilterDegree(deg)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterDegree === deg 
                    ? 'bg-brand-600 text-white' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
               >
                 {deg}
               </button>
             ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-brand-600" size={48} />
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map(scholarship => (
              <ScholarshipCard key={scholarship.id} data={scholarship} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">No scholarships found matching your criteria.</p>
            <button 
              onClick={() => {setSearchTerm(''); setFilterDegree('All')}} 
              className="mt-4 text-brand-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};