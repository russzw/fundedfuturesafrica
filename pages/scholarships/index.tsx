'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import { getScholarships } from '../../services/firebase';
import { Scholarship } from '../../types';
import { ScholarshipCard } from '../../components/ScholarshipCard';

const ITEMS_PER_PAGE = 10;

const ScholarshipsPage: React.FC = () => {
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDegree, setFilterDegree] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getScholarships();
        // Sort by deadline, with future deadlines first
        const sortedData = data.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        setAllScholarships(sortedData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredScholarships = allScholarships.filter(item => {
    const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDegree = filterDegree === 'All' || item.degree === filterDegree;
    return matchesSearch && matchesDegree;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredScholarships.length / ITEMS_PER_PAGE);
  const paginatedScholarships = filteredScholarships.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const degreeTypes = ['All', 'High School', 'Diploma', 'Bachelors', 'Masters', 'PhD', 'Post-Doc', 'Fellowship', 'Vocational', 'Research', 'Internship', 'Bootcamp', 'Other'];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Explore Scholarships</h1>
          <p className="text-slate-500 text-lg">Find the perfect funding opportunity to fuel your ambitions.</p>
        </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by title, provider, or location..."
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    />
                </div>
                {/* Filter Dropdown */}
                 <div className="relative">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select 
                        value={filterDegree}
                        onChange={e => {
                            setFilterDegree(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full pl-11 pr-4 py-3 border appearance-none bg-white border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    >
                        {degreeTypes.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="animate-spin text-brand-600" size={48} />
          </div>
        ) : (
          <>
            <div className="mb-8 text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-800">{paginatedScholarships.length}</span> of <span className="font-semibold text-slate-800">{filteredScholarships.length}</span> matching scholarships.
            </div>
            {paginatedScholarships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedScholarships.map(scholarship => (
                        <ScholarshipCard key={scholarship.id} data={scholarship} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-xl border border-dashed">
                    <h3 className="text-xl font-semibold text-slate-800">No Matching Scholarships Found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your search or filter criteria.</p>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowLeft size={16} /> Previous
                </button>
                
                <span className="text-sm font-medium text-slate-600">
                    Page {currentPage} of {totalPages}
                </span>

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ScholarshipsPage;
