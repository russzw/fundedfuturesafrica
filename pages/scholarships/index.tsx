'use client';

import { useState, useEffect, useMemo } from 'react';
import { getScholarships } from '../../services/firebase';
import { Scholarship } from '../../types';
import { ScholarshipCard } from '../../components/ScholarshipCard';
import { Search, X, Loader2, SlidersHorizontal, RotateCcw } from 'lucide-react';

const DEGREE_OPTIONS = ['High School', 'Diploma', 'Bachelors', 'Masters', 'PhD', 'Post-Doc', 'Fellowship', 'Vocational', 'Research', 'Internship', 'Bootcamp'];
const SORT_OPTIONS = [
  { value: 'deadline_asc', label: 'Deadline (Soonest)' },
  { value: 'deadline_desc', label: 'Deadline (Latest)' },
  { value: 'funding_desc', label: 'Funding (High to Low)' },
  { value: 'funding_asc', label: 'Funding (Low to High)' },
];

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [degreeFilter, setDegreeFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('deadline_asc');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

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
      prev.includes(degree) ? prev.filter(d => d !== degree) : [...prev, degree]
    );
  };

  const filteredAndSortedScholarships = useMemo(() => {
    let result = scholarships;
    if (searchTerm) {
      result = result.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (degreeFilter.length > 0) {
      result = result.filter(s =>
        Array.isArray(s.degree) ? s.degree.some(d => degreeFilter.includes(d)) : degreeFilter.includes(s.degree)
      );
    }
    result.sort((a, b) => {
      if (sortOrder === 'deadline_asc') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortOrder === 'deadline_desc') return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      if (sortOrder === 'funding_asc') {
        return (parseFloat(a.fundingAmount.replace(/[^\d.-]/g, '')) || 0) - (parseFloat(b.fundingAmount.replace(/[^\d.-]/g, '')) || 0);
      }
      if (sortOrder === 'funding_desc') {
        return (parseFloat(b.fundingAmount.replace(/[^\d.-]/g, '')) || 0) - (parseFloat(a.fundingAmount.replace(/[^\d.-]/g, '')) || 0);
      }
      return 0;
    });
    return result;
  }, [scholarships, searchTerm, degreeFilter, sortOrder]);

  const visibleScholarships = filteredAndSortedScholarships.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedScholarships.length;
  const clearFilters = () => { setSearchTerm(''); setDegreeFilter([]); setSortOrder('deadline_asc'); };
  const activeFilterCount = degreeFilter.length + (sortOrder !== 'deadline_asc' ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-heading font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300 block mb-3">Sort by</label>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 darker:border-zinc-700 rounded-lg bg-white dark:bg-slate-700 darker:bg-zinc-800 text-sm text-slate-700 dark:text-slate-200 darker:text-zinc-200 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-all">
          {SORT_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
        </select>
      </div>
      <div>
        <label className="text-sm font-heading font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300 block mb-3">Degree Level</label>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {DEGREE_OPTIONS.map(degree => (
            <label key={degree} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={degreeFilter.includes(degree)} onChange={() => handleDegreeFilterChange(degree)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600/20 transition-all" />
              <span className="text-sm text-slate-600 dark:text-slate-400 darker:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 darker:group-hover:text-zinc-200 transition-colors">{degree}</span>
            </label>
          ))}
        </div>
      </div>
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-600 darker:border-zinc-700">
          <button onClick={clearFilters} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 darker:text-zinc-300 bg-slate-100 dark:bg-slate-700 darker:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-slate-600 darker:hover:bg-zinc-700 rounded-lg transition-colors">
            <RotateCcw size={14} /> Clear All Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 darker:bg-black pt-20 pb-12 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-b from-emerald-700 to-emerald-600 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-4">Find Your Scholarship</h1>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto mb-8">Explore opportunities across Africa and beyond. Your future awaits.</p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search by title, provider, or keyword..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-amber-400 outline-none shadow-lg text-base" />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex gap-3">
          <button onClick={() => setIsFilterMenuOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 darker:bg-zinc-900 border border-slate-200 dark:border-slate-700 darker:border-zinc-800 text-slate-700 dark:text-slate-200 darker:text-zinc-200 rounded-lg font-medium text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 darker:hover:bg-zinc-800 transition-colors">
            <SlidersHorizontal size={16} /> Filters
            {activeFilterCount > 0 && (<span className="bg-emerald-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{activeFilterCount}</span>)}
          </button>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 darker:bg-zinc-900 border border-slate-200 dark:border-slate-700 darker:border-zinc-800 rounded-lg text-sm text-slate-500 dark:text-slate-400 darker:text-zinc-400">
            <span className="font-medium text-slate-700 dark:text-slate-200 darker:text-zinc-200">{filteredAndSortedScholarships.length}</span> results
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="filter-section">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">Filters</h3>
                  {activeFilterCount > 0 && (<button onClick={clearFilters} className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium">Clear all</button>)}
                </div>
                <FilterContent />
              </div>
              <div className="mt-4 text-sm text-slate-500 dark:text-slate-400 darker:text-zinc-400 text-center">
                Showing <span className="font-semibold text-slate-700 dark:text-slate-200 darker:text-zinc-200">{filteredAndSortedScholarships.length}</span> scholarships
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow min-w-0">
            {loading ? (
              <div className="flex justify-center py-24"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
            ) : visibleScholarships.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {visibleScholarships.map(scholarship => (<ScholarshipCard key={scholarship.id} data={scholarship} />))}
                </div>
                {hasMore && (
                  <div className="text-center mt-12">
                    <button onClick={() => setVisibleCount(prev => prev + 6)} className="btn-secondary px-10">
                      Load More <span className="text-slate-400 text-sm">({filteredAndSortedScholarships.length - visibleCount} remaining)</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-800 darker:bg-zinc-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 darker:border-zinc-700">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 darker:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="text-slate-400" size={24} /></div>
                <h3 className="font-heading text-xl font-bold text-slate-700 dark:text-slate-200 darker:text-zinc-200 mb-2">No Matching Scholarships</h3>
                <p className="text-slate-500 dark:text-slate-400 darker:text-zinc-400 text-sm mb-6">Try adjusting your search or filter criteria.</p>
                <button onClick={clearFilters} className="btn-primary text-sm"><RotateCcw size={14} /> Clear All Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsFilterMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-800 darker:bg-zinc-950 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 darker:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 darker:bg-zinc-950 z-10">
              <h2 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100 darker:text-zinc-100">Filters</h2>
              <button onClick={() => setIsFilterMenuOpen(false)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 darker:hover:bg-zinc-800 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5"><FilterContent /></div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 darker:border-zinc-800 sticky bottom-0 bg-white dark:bg-slate-800 darker:bg-zinc-950">
              <button onClick={() => setIsFilterMenuOpen(false)} className="w-full btn-primary justify-center">Show {filteredAndSortedScholarships.length} Results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipsPage;
