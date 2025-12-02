'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getScholarshipById } from '../../services/firebase';
import { Scholarship } from '../../types';
import { ArrowLeft, Link as LinkIcon, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import WhatsappIcon from '../../components/WhatsappIcon';

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
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }

    if (id && typeof id === 'string') {
      const fetchScholarship = async () => {
        setLoading(true);
        try {
          const data = await getScholarshipById(id);
          if (data) {
            setScholarship(data);
            setShareTitle(`Check out this scholarship: ${data.title}`);
          } else {
            setError('Scholarship not found.');
          }
        } catch (err) {
          setError('Failed to fetch scholarship details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchScholarship();
    }
  }, [id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      setShowCopyFallback(true);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen dark:bg-slate-900 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen dark:bg-slate-900 text-red-500">{error}</div>;
  }

  if (!scholarship) {
    return <div className="flex justify-center items-center min-h-screen dark:bg-slate-900 text-white">Scholarship not found.</div>;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
              <ArrowLeft size={18} className="mr-2" />
              Back to Scholarships
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">{scholarship.title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">Provided by: <span className="font-semibold">{scholarship.provider}</span></p>

            <div className="flex flex-wrap gap-4 mb-8">
                <span className="inline-block bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-400 text-sm font-semibold px-3 py-1.5 rounded-full">{scholarship.fundingAmount}</span>
                <span className="inline-block bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300 text-sm font-semibold px-3 py-1.5 rounded-full">Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                <span className="inline-block bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300 text-sm font-semibold px-3 py-1.5 rounded-full">{Array.isArray(scholarship.degree) ? scholarship.degree.join(', ') : scholarship.degree}</span>
            </div>

            <div className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>{scholarship.description}</p>
            </div>
          </div>
          
          <div className="bg-slate-50/70 dark:bg-slate-700/50 px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Share this opportunity:</span>
                <div className="flex items-center gap-2">
                   <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500"><Facebook size={22} /></a>
                   <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400"><Twitter size={22} /></a>
                   <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-500"><Linkedin size={22} /></a>
                   <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-green-500 dark:hover:text-green-400"><WhatsappIcon /></a>
                    <button onClick={handleCopyLink} className="relative text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400">
                      <LinkIcon size={22}/>
                       {isCopied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded">Copied!</span>}
                    </button>
                </div>
            </div>
            
            <a 
              href={scholarship.externalLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setIsButtonClicked(true)}
              className={`w-full sm:w-auto inline-block bg-brand-600 text-white font-bold text-center px-8 py-3 rounded-lg hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-all shadow-md ${isButtonClicked ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isButtonClicked ? (
                <div className="flex justify-center items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : "Apply Now"}
            </a>
          </div>
        </div>

        {showCopyFallback && (
          <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800/50 rounded-lg">
            <p className="font-semibold text-yellow-800 dark:text-yellow-300">Couldn&apos;t copy to clipboard.</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">Please copy the link manually:</p>
            <input type="text" readOnly value={shareUrl} className="mt-2 w-full px-2 py-1 border border-yellow-400 dark:border-yellow-700 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-300" />
          </div>
        )}

      </div>
    </div>
  );
};

export default ScholarshipDetailsPage;