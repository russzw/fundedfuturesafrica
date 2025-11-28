import React from 'react';
import { MapPin, Calendar, Banknote, GraduationCap, ExternalLink, AlertCircle } from 'lucide-react';
import { Scholarship } from '../types';

interface Props {
  data: Scholarship;
  adminMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ScholarshipCard: React.FC<Props> = ({ data, adminMode, onEdit, onDelete }) => {
  // Date formatting and validation logic
  const getDeadlineStatus = (dateString: string) => {
    const date = new Date(dateString);
    const isValid = !isNaN(date.getTime());
    
    if (!isValid) return { isExpired: false, label: dateString };

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate day comparison
    const isExpired = date < today;

    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    return { 
      isExpired, 
      label: isExpired ? 'Deadline Passed' : `Apply by ${formattedDate}` 
    };
  };

  const { isExpired, label } = getDeadlineStatus(data.deadline);

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full ${isExpired && !adminMode ? 'opacity-80 grayscale' : 'border-slate-200'}`}>
      <div className="h-48 overflow-hidden bg-slate-200 relative group">
        <img 
          src={data.imageUrl || `https://picsum.photos/seed/${data.id}/800/400`} 
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-brand-800 shadow-sm">
          {data.provider}
        </div>
        {isExpired && !adminMode && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[3px]">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
              <AlertCircle size={16} /> Closed
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-snug">{data.title}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-3 mb-5 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-brand-600 flex-shrink-0" />
            <span className="truncate font-medium">{Array.isArray(data.degree) ? data.degree.join(', ') : data.degree}</span>
          </div>
          <div className="flex items-center gap-2">
            <Banknote size={16} className="text-brand-600 flex-shrink-0" />
            <span className="truncate font-medium">{data.fundingAmount}</span>
          </div>
          <div className={`flex items-center gap-2 ${isExpired ? 'text-red-600 font-semibold' : ''}`}>
            <Calendar size={16} className={isExpired ? 'text-red-600 flex-shrink-0' : 'text-brand-600 flex-shrink-0'} />
            <span className="truncate">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-brand-600 flex-shrink-0" />
            <span className="truncate">{data.location}</span>
          </div>
        </div>

        <p className="text-slate-600 text-[15px] mb-6 line-clamp-3 flex-1 leading-relaxed">
          {data.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100">
          {adminMode ? (
            <div className="flex gap-3">
              <button 
                onClick={onEdit}
                className="flex-1 py-2 px-4 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg hover:bg-slate-200 font-medium text-sm transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={onDelete}
                className="flex-1 py-2 px-4 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <a 
              href={data.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full font-semibold text-sm transition-all duration-300 ${
                isExpired 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              }`}
              onClick={(e) => isExpired && e.preventDefault()}
            >
              {isExpired ? 'Applications Closed' : 'Learn More & Apply'} 
              {!isExpired && <ExternalLink size={16} />}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};