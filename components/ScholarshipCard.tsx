import React from 'react';
import { MapPin, Calendar, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react';
import { Scholarship } from '../types';
import Link from 'next/link';
import { getScholarshipImage } from '../utils/placeholderImages';

interface Props {
  data: Scholarship;
  adminMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ScholarshipCard: React.FC<Props> = ({ data, adminMode, onEdit, onDelete }) => {
  const [isClicked, setIsClicked] = React.useState(false);

  const getDeadlineStatus = (dateString: string) => {
    const date = new Date(dateString);
    const isValid = !isNaN(date.getTime());
    if (!isValid) return { isExpired: false, label: dateString };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isExpired = date < today;
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return { isExpired, label: isExpired ? 'Deadline Passed' : `Deadline: ${formattedDate}` };
  };

  const { isExpired, label } = getDeadlineStatus(data.deadline);

  const getFundingBadge = (amount: string) => {
    const lower = amount.toLowerCase();
    if (lower.includes('full')) return 'Fully Funded';
    if (lower.includes('partial')) return 'Partial Funding';
    if (lower.includes('stipend')) return 'Stipend Included';
    return amount.length > 20 ? amount.substring(0, 20) + '...' : amount;
  };

  return (
    <div className={`card flex flex-col h-full ${isExpired && !adminMode ? 'opacity-70' : ''}`}>
      {/* Image Header */}
      <div className="h-44 overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 darker:from-emerald-900/20 darker:to-zinc-800 relative group">
        <img
          src={getScholarshipImage(data.imageUrl, data.id)}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Funding Badge */}
        <div className="absolute top-3 left-3 bg-amber-400 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 bg-slate-800/30 rounded-full" />
          {getFundingBadge(data.fundingAmount)}
        </div>

        {/* Provider Badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm">
          {data.provider}
        </div>

        {/* Expired Overlay */}
        {isExpired && !adminMode && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
              <AlertCircle size={16} /> Applications Closed
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-3 line-clamp-2 leading-snug">
          {data.title}
        </h3>

        {/* Pill Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(data.degree) ? (
            data.degree.slice(0, 3).map((d, i) => (
              <span key={i} className="pill-tag">
                <GraduationCap size={12} className="mr-1" />
                {d}
              </span>
            ))
          ) : (
            <span className="pill-tag">
              <GraduationCap size={12} className="mr-1" />
              {data.degree}
            </span>
          )}
          <span className="pill-tag">
            <MapPin size={12} className="mr-1" />
            {data.location}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 darker:text-zinc-400 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
          {data.description}
        </p>

        {/* Deadline & Action */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 darker:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-medium flex items-center gap-1.5 ${isExpired ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 darker:text-zinc-400'}`}>
              <Calendar size={14} />
              {label}
            </span>
          </div>

          {adminMode ? (
            <div className="flex gap-3">
              <button
                onClick={onEdit}
                className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-700 darker:bg-zinc-800 border border-slate-200 dark:border-slate-600 darker:border-zinc-700 text-slate-700 dark:text-slate-200 darker:text-zinc-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 font-medium text-sm transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-2.5 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 font-medium text-sm transition-all duration-200"
              >
                Delete
              </button>
            </div>
          ) : (
            <Link
              href={`/scholarships/${data.id}`}
              onClick={() => setIsClicked(true)}
              className={`w-full btn-primary justify-center text-sm ${
                isExpired
                  ? 'bg-slate-200 dark:bg-slate-700 darker:bg-zinc-700 text-slate-500 dark:text-slate-400 cursor-not-allowed hover:shadow-none hover:scale-100'
                  : isClicked
                  ? 'opacity-60 cursor-not-allowed'
                  : ''
              }`}
            >
              {isClicked ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </>
              ) : isExpired ? (
                'Applications Closed'
              ) : (
                <>
                  View Details
                  <ArrowRight size={16} />
                </>
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
