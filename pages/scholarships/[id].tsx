'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getScholarshipById } from '../../services/firebase';
import { Scholarship } from '../../types';
import { ArrowLeft, Link as LinkIcon, Facebook, Twitter, Linkedin, Calendar, MapPin, GraduationCap, Banknote, ExternalLink, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import WhatsappIcon from '../../components/WhatsappIcon';
import { getScholarshipImage } from '../../utils/placeholderImages';

const ScholarshipDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showCopyFallback, setShowCopyFallback] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') setShareUrl(window.location.href);
    if (id && typeof id === 'string') {
      const fetchScholarship = async () => {
        setLoading(true);
        try {
          const data = await getScholarshipById(id);
          if (data) { setScholarship(data); setShareTitle(`Check out this scholarship: ${data.title}`); }
          else setError('Scholarship not found.');
        } catch (err) { setError('Failed to fetch scholarship details.'); console.error(err); }
        finally { setLoading(false); }
      };
      fetchScholarship();
    }
  }, [id]);

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }
    catch (err) { setShowCopyFallback(true); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 darker:bg-black">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading scholarship details...</p>
      </div>
    </div>
  );

  if (error || !scholarship) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 darker:bg-black">
      <div className="text-center">
        <p className="text-slate-600 dark:text-slate-300 text-lg font-medium mb-4">{error || 'Scholarship not found.'}</p>
        <Link href="/scholarships" className="btn-primary"><ArrowLeft size={16} /> Back to Scholarships</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 darker:bg-black pt-20 pb-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/scholarships" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium text-sm mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Scholarships
        </Link>

        <div className="bg-white dark:bg-slate-800 darker:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 darker:border-zinc-800 transition-colors duration-300">
          <div className="h-64 md:h-80 relative">
            <img src={getScholarshipImage(scholarship.imageUrl, scholarship.id)} alt={scholarship.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-amber-400 text-slate-800 px-4 py-2 rounded-full text-sm font-bold shadow-md inline-flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-slate-800/30 rounded-full" />{scholarship.fundingAmount}
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white leading-tight">{scholarship.title}</h1>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold border border-emerald-100 dark:border-emerald-800">
                <GraduationCap size={16} />{Array.isArray(scholarship.degree) ? scholarship.degree.join(', ') : scholarship.degree}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 darker:bg-zinc-800 text-slate-700 dark:text-slate-200 darker:text-zinc-200 rounded-full text-sm font-semibold">
                <MapPin size={16} />{scholarship.location}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 darker:bg-zinc-800 text-slate-700 dark:text-slate-200 darker:text-zinc-200 rounded-full text-sm font-semibold">
                <Calendar size={16} />{new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="mb-8">
              <p className="text-sm text-slate-500 dark:text-slate-400 darker:text-zinc-400 mb-1">Provided by</p>
              <p className="text-lg font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">{scholarship.provider}</p>
            </div>

            <div className="mb-8">
              <h2 className="font-heading text-xl font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-4">About this Scholarship</h2>
              <p className="text-slate-600 dark:text-slate-300 darker:text-zinc-300 leading-relaxed whitespace-pre-wrap">{scholarship.description}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 darker:bg-zinc-900/50 rounded-xl p-6 mb-8 border border-slate-200 dark:border-slate-600 darker:border-zinc-700">
              <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-4">Key Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Banknote className="text-emerald-600 dark:text-emerald-400" size={20} />, label: 'Funding Amount', value: scholarship.fundingAmount },
                  { icon: <Calendar className="text-emerald-600 dark:text-emerald-400" size={20} />, label: 'Application Deadline', value: new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                  { icon: <MapPin className="text-emerald-600 dark:text-emerald-400" size={20} />, label: 'Location', value: scholarship.location },
                  { icon: <GraduationCap className="text-emerald-600 dark:text-emerald-400" size={20} />, label: 'Degree Level', value: Array.isArray(scholarship.degree) ? scholarship.degree.join(', ') : scholarship.degree },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 darker:bg-emerald-900/20 rounded-lg flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 darker:text-zinc-400 mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 darker:text-zinc-100">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 darker:bg-zinc-900/50 border-t border-slate-200 dark:border-slate-700 darker:border-zinc-800 px-6 md:px-10 py-6 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300">Share:</span>
                <div className="flex items-center gap-2">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 darker:bg-zinc-800 text-slate-600 dark:text-slate-300 darker:text-zinc-300 hover:bg-blue-100 hover:text-blue-600 transition-all"><Facebook size={16} /></a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 darker:bg-zinc-800 text-slate-600 dark:text-slate-300 darker:text-zinc-300 hover:bg-sky-100 hover:text-sky-500 transition-all"><Twitter size={16} /></a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 darker:bg-zinc-800 text-slate-600 dark:text-slate-300 darker:text-zinc-300 hover:bg-blue-100 hover:text-blue-700 transition-all"><Linkedin size={16} /></a>
                  <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 darker:bg-zinc-800 text-slate-600 dark:text-slate-300 darker:text-zinc-300 hover:bg-green-100 hover:text-green-600 transition-all"><WhatsappIcon /></a>
                  <button onClick={handleCopyLink} className="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 darker:bg-zinc-800 text-slate-600 dark:text-slate-300 darker:text-zinc-300 hover:bg-emerald-100 hover:text-emerald-600 transition-all">
                    <LinkIcon size={16} />
                    {isCopied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap flex items-center gap-1"><CheckCircle size={12} /> Copied!</span>}
                  </button>
                </div>
              </div>
              <a href={scholarship.externalLink} target="_blank" rel="noopener noreferrer" onClick={() => setIsButtonClicked(true)} className={`btn-primary px-8 text-base ${isButtonClicked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {isButtonClicked ? (<><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Processing...</>) : (<>Apply Now<ExternalLink size={16} /></>)}
              </a>
            </div>
          </div>
        </div>

        {showCopyFallback && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 darker:bg-amber-900/10 border border-amber-200 dark:border-amber-800 darker:border-amber-900/50 rounded-xl">
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Couldn&apos;t copy to clipboard.</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Please copy the link manually:</p>
            <input type="text" readOnly value={shareUrl} className="mt-2 w-full px-3 py-2 border border-amber-300 dark:border-amber-700 darker:border-amber-800 rounded-lg bg-white dark:bg-slate-800 darker:bg-zinc-900 text-sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipDetailsPage;
