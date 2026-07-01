import React, { useState } from 'react';
import { X, Loader2, Radar, CheckCircle, AlertCircle, ExternalLink, GraduationCap, MapPin, Calendar, Globe, ArrowRight, DollarSign } from 'lucide-react';
import { ScholarshipFormData } from '../types';

type ScrapedItem = ScholarshipFormData;

interface ScrapeModalProps {
  onClose: () => void;
  onPost: (items: ScholarshipFormData[]) => void;
}

export const ScrapeModal: React.FC<ScrapeModalProps> = ({ onClose, onPost }) => {
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [results, setResults] = useState<ScrapedItem[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [scrapeSource, setScrapeSource] = useState('');

  const handleScrape = async () => {
    if (!url) return;
    setError('');
    setIsScraping(true);
    setResults([]);
    setSelected(new Set());

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scraping failed');
      if (data.scholarships.length === 0) {
        setError('No scholarship listings found on this page. Try a different URL with visible scholarship content.');
      } else {
        setResults(data.scholarships);
        setScrapeSource(data.sourceUrl);
        setSelected(new Set(data.scholarships.map((_: any, i: number) => i)));
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while scraping');
    } finally {
      setIsScraping(false);
    }
  };

  const toggleSelect = (index: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === results.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(results.map((_, i) => i)));
    }
  };

  const updateField = (index: number, field: keyof ScrapedItem, value: any) => {
    setResults(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handlePost = async () => {
    const items = results.filter((_, i) => selected.has(i));
    if (items.length === 0) return;
    setIsPosting(true);
    try {
      await onPost(items);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 darker:bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 darker:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 darker:border-zinc-800 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 darker:bg-emerald-900/20 p-2 rounded-xl">
              <Radar className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">Scrape Scholarships</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 darker:text-zinc-400">Fetch listings from any scholarship webpage</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 darker:hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* URL Input */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/scholarships"
                className="input-base pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
              />
            </div>
            <button
              onClick={handleScrape}
              disabled={isScraping || !url}
              className="btn-primary px-6 flex-shrink-0"
            >
              {isScraping ? <Loader2 className="animate-spin" size={18} /> : <Radar size={18} />}
              {isScraping ? 'Scraping...' : 'Scrape'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 darker:bg-red-900/10 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl flex items-start gap-3 mb-6 border border-red-200 dark:border-red-800 darker:border-red-900/50">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 darker:text-zinc-300">
                  Found <span className="font-bold text-emerald-600 dark:text-emerald-400">{results.length}</span> scholarships from{' '}
                  <span className="font-medium">{scrapeSource}</span>
                </p>
                <button onClick={toggleAll} className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium">
                  {selected.size === results.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-4">
                {results.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selected.has(index)
                        ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10 darker:bg-emerald-900/5 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 darker:border-zinc-800 bg-white dark:bg-slate-800/50 darker:bg-zinc-900/50 opacity-60'
                    }`}
                    onClick={() => toggleSelect(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selected.has(index)
                          ? 'border-emerald-600 bg-emerald-600'
                          : 'border-slate-300 dark:border-slate-600 darker:border-zinc-600'
                      }`}>
                        {selected.has(index) && <CheckCircle size={14} className="text-white" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title - editable */}
                        <input
                          value={item.title}
                          onChange={(e) => { e.stopPropagation(); updateField(index, 'title', e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 outline-none w-full text-lg mb-2 transition-colors"
                          placeholder="Scholarship title"
                        />
                        {/* Provider - editable */}
                        <input
                          value={item.provider}
                          onChange={(e) => { e.stopPropagation(); updateField(index, 'provider', e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-slate-500 dark:text-slate-400 darker:text-zinc-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 outline-none w-full mb-3 transition-colors"
                          placeholder="Provider"
                        />

                        {/* Editable metadata row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                          {/* Degree pills - read only */}
                          <div className="flex items-center gap-1.5">
                            <GraduationCap size={12} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                            <span className="pill-tag text-xs truncate">{item.degree.join(', ')}</span>
                          </div>
                          {/* Location - editable */}
                          <div className="relative">
                            <MapPin size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                            <input
                              value={item.location}
                              onChange={(e) => { e.stopPropagation(); updateField(index, 'location', e.target.value); }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full text-xs bg-slate-50 dark:bg-slate-700 darker:bg-zinc-800 border border-slate-200 dark:border-slate-600 darker:border-zinc-700 rounded-md px-2 pl-6 py-1.5 text-slate-700 dark:text-slate-200 darker:text-zinc-200 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                              placeholder="Location"
                            />
                          </div>
                          {/* Deadline - editable */}
                          <div className="relative">
                            <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                            <input
                              value={item.deadline}
                              onChange={(e) => { e.stopPropagation(); updateField(index, 'deadline', e.target.value); }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full text-xs bg-slate-50 dark:bg-slate-700 darker:bg-zinc-800 border border-slate-200 dark:border-slate-600 darker:border-zinc-700 rounded-md px-2 pl-6 py-1.5 text-slate-700 dark:text-slate-200 darker:text-zinc-200 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                              placeholder="Deadline (YYYY-MM-DD)"
                            />
                          </div>
                        </div>

                        {/* Funding - editable */}
                        <div className="relative mb-3">
                          <DollarSign size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                          <input
                            value={item.fundingAmount}
                            onChange={(e) => { e.stopPropagation(); updateField(index, 'fundingAmount', e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full text-xs bg-slate-50 dark:bg-slate-700 darker:bg-zinc-800 border border-slate-200 dark:border-slate-600 darker:border-zinc-700 rounded-md px-2 pl-6 py-1.5 text-slate-700 dark:text-slate-200 darker:text-zinc-200 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                            placeholder="Funding amount"
                          />
                        </div>

                        {/* Description - editable */}
                        <textarea
                          value={item.description}
                          onChange={(e) => { e.stopPropagation(); updateField(index, 'description', e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          rows={3}
                          className="w-full text-sm text-slate-600 dark:text-slate-300 darker:text-zinc-300 bg-slate-50 dark:bg-slate-700 darker:bg-zinc-800 border border-slate-200 dark:border-slate-600 darker:border-zinc-700 rounded-lg outline-none resize-none p-2 focus:ring-1 focus:ring-emerald-500 transition-colors"
                          placeholder="Scholarship description / summary"
                        />

                        {/* External Link - editable */}
                        <div className="flex items-center gap-2 mt-2">
                          <ExternalLink size={12} className="text-slate-400 flex-shrink-0" />
                          <input
                            value={item.externalLink}
                            onChange={(e) => { e.stopPropagation(); updateField(index, 'externalLink', e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-slate-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 outline-none flex-1 truncate transition-colors"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isScraping && results.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 darker:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Radar className="text-slate-400" size={24} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 darker:text-zinc-400 font-medium">Enter a scholarship page URL to get started</p>
              <p className="text-slate-400 dark:text-slate-500 darker:text-zinc-500 text-sm mt-1">Works best with pages that list multiple scholarships</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-700 darker:border-zinc-800 flex justify-between items-center flex-shrink-0 bg-white dark:bg-slate-800 darker:bg-zinc-900">
            <p className="text-sm text-slate-500 dark:text-slate-400 darker:text-zinc-400">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{selected.size}</span> of {results.length} selected
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
              <button
                onClick={handlePost}
                disabled={selected.size === 0 || isPosting}
                className="btn-primary text-sm"
              >
                {isPosting ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                Post {selected.size} Scholarship{selected.size !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
