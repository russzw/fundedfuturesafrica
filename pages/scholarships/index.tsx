'use client';

import { useState, useEffect, useMemo } from 'react';
import { getScholarships, isFirebaseInitialized } from '../../services/firebase';
import { Scholarship } from '../../types';
import { ScholarshipCard } from '../../components/ScholarshipCard';
import { Search, Filter, X, Loader2, HardDrive, Database } from 'lucide-react';

const DEGREE_OPTIONS = ["High School", "Diploma", "Bachelors", "Masters", "PhD", "Post-Doc", "Fellowship", "Vocational", "Research", "Internship", "Bootcamp", "Other"];

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [degreeFilter, setDegreeFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('deadline_asc');

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getScholarships();
        setScholarships(data);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDegreeFilterChange = (degree: string) => {
    setDegreeFilter(prev => 
      prev.includes(degree) 
        ? prev.filter(d => d !== degree) 
        : [...prev, degree]
    );
  };

  const filteredAndSortedScholarships = useMemo(() => {
    let result = scholarships;

    // Filtering
    if (searchTerm) {
      result = result.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (degreeFilter.length > 0) {
        result = result.filter(s => 
            Array.isArray(s.degree) 
                ? s.degree.some(d => degreeFilter.includes(d))
                : degreeFilter.includes(s.degree)
        );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'deadline_asc') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortOrder === 'deadline_desc') {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      }
       if (sortOrder === 'funding_asc') {
        const fundingA = parseFloat(a.fundingAmount.replace(/[^\d.-]/g, '')) || 0;
        const fundingB = parseFloat(b.fundingAmount.replace(/[^\d.-]/g, '')) || 0;
        return fundingA - fundingB;
    }
    if (sortOrder === 'funding_desc') {
        const fundingA = parseFloat(a.fundingAmount.replace(/[^\d.-]/g, '')) || 0;
        const fundingB = parseFloat(b.fundingAmount.replace(/[^\d.-]/g, '')) || 0;
        return fundingB - fundingA;
    }
      return 0;
    });

    return result;
  }, [scholarships, searchTerm, degreeFilter, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setDegreeFilter([]);
    setSortOrder('deadline_asc');
  }

  const FilterContent = () => (
    <div className="space-y-6">
        {/* Sort Controls */}
        <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Sort by</label>
            <select 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value)} 
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-shadow bg-white dark:bg-slate-800"
            >
                <option value="deadline_asc">Deadline (Soonest)</option>
                <option value="deadline_desc">Deadline (Latest)</option>
                <option value="funding_asc">Funding (Low to High)</option>
                <option value="funding_desc">Funding (High to Low)</option>
            </select>
        </div>

        {/* Degree Filter */}
        <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Degree Type</label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {DEGREE_OPTIONS.map(degree => (
                    <label key={degree} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={degreeFilter.includes(degree)} 
                          onChange={() => handleDegreeFilterChange(degree)} 
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500 bg-transparent"
                        />
                        <span className="text-slate-600 dark:text-slate-400">{degree}</span>
                    </label>
                ))}
            </div>
        </div>
        
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
             <button 
              onClick={clearFilters} 
              className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Clear All Filters
            </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pt-24 pb-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-5xl md:text-6xl">
                    Find Your Scholarship
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 dark:text-slate-400">
                    Explore opportunities across Africa and beyond. Your future awaits.
                </p>
                  <div className="mt-2 text-center">
                    {isFirebaseInitialized ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <Database size={12} />
                        Live Database
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200" title="Add Firebase keys to .env to connect">
                        <HardDrive size={12} />
                        Local Demo Mode
                      </span>
                    )}
                </div>
            </div>

            {/* Search Bar */}
             <div className="mb-8 sticky top-20 z-20 bg-slate-50/80 dark:bg-black/80 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto flex gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by title, provider, or keyword..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all shadow-sm bg-white dark:bg-slate-900"
                        />
                    </div>
                    <button 
                      onClick={() => setIsFilterMenuOpen(true)} 
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors shadow-sm md:hidden"
                    >
                        <Filter size={18}/>
                        <span>Filters</span>
                         {degreeFilter.length > 0 && 
                          <span className="bg-brand-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{degreeFilter.length}</span>
                        }
                    </button>
                </div>
            </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Desktop Filters */}
        <aside className="hidden md:block w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="sticky top-44">
               <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2 border-slate-200 dark:border-slate-700">Filters</h3>
               <FilterContent />
            </div>
        </aside>

        {/* Scholarship Grid */}
        <main className="flex-grow min-w-0">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-600" size={48} />
            </div>
          ) : filteredAndSortedScholarships.length > 0 ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedScholarships.map(scholarship => (
                <ScholarshipCard key={scholarship.id} data={scholarship} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Matching Scholarships</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200 md:hidden">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Filters</h2>
                <button onClick={() => setIsFilterMenuOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 flex-grow">
                <FilterContent />
              </div>
                <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/50 sticky bottom-0">
                    <button onClick={() => setIsFilterMenuOpen(false)} className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-700 transition-all">
                        Apply Filters
                    </button>
                </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ScholarshipsPage;
