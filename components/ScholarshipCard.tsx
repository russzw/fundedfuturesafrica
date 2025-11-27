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
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full ${isExpired && !adminMode ? 'opacity-75 grayscale-[0.5]' : 'border-slate-200'}`}>
      <div className="h-48 overflow-hidden bg-slate-100 relative group">
        <img 
          src={data.imageUrl || `https://picsum.photos/seed/${data.id}/800/400`} 
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-brand-700 shadow-sm">
          {data.provider}
        </div>
        {isExpired && !adminMode && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
              <AlertCircle size={16} /> Closed
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{data.title}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-2 mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-brand-600 flex-shrink-0" />
            <span className="truncate">{data.degree}</span>
          </div>
          <div className="flex items-center gap-2">
            <Banknote size={16} className="text-brand-600 flex-shrink-0" />
            <span className="truncate">{data.fundingAmount}</span>
          </div>
          <div className={`flex items-center gap-2 ${isExpired ? 'text-red-600 font-medium' : ''}`}>
            <Calendar size={16} className={isExpired ? 'text-red-600 flex-shrink-0' : 'text-brand-600 flex-shrink-0'} />
            <span className="truncate">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-brand-600 flex-shrink-0" />
            <span className="truncate">{data.location}</span>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1">
          {data.description}
        </p>

        <div className="mt-auto">
          {adminMode ? (
            <div className="flex gap-3">
              <button 
                onClick={onEdit}
                className="flex-1 py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={onDelete}
                className="flex-1 py-2 px-4 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <a 
              href={data.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors duration-300 ${
                isExpired 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-brand-600 shadow-md hover:shadow-lg'
              }`}
              onClick={(e) => isExpired && e.preventDefault()}
            >
              {isExpired ? 'Applications Closed' : 'Learn More'} 
              {!isExpired && <ExternalLink size={16} />}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};