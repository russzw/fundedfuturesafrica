'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Loader2, LogOut, AlertTriangle, Trash2, Database, HardDrive, Mail, Key, Shield, Radar } from 'lucide-react';
import {
  getScholarships, createScholarship, updateScholarship, deleteScholarship,
  isFirebaseInitialized, loginAdmin, logoutAdmin, subscribeToAuth
} from '../services/firebase';
import { Scholarship, ScholarshipFormData } from '../types';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { ScrapeModal } from '../components/ScrapeModal';

const DEGREE_OPTIONS = ["High School", "Diploma", "Bachelors", "Masters", "PhD", "Post-Doc", "Fellowship", "Vocational", "Research", "Internship", "Bootcamp", "Other"];
const INITIAL_FORM: ScholarshipFormData = { title: '', provider: '', degree: [], fundingAmount: '', deadline: '', location: '', externalLink: '', imageUrl: '', description: '' };

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ScholarshipFormData>(INITIAL_FORM);
  const [isInactive, setIsInactive] = useState(false);
  const [isScrapeModalOpen, setIsScrapeModalOpen] = useState(false);
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

  const handleLogout = useCallback(async () => {
    await logoutAdmin();
    setUser(null);
    setScholarships([]);
    if (!isFirebaseInitialized) sessionStorage.removeItem('ffa_auth_user');
    setIsInactive(false);
  }, []);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      setIsInactive(false);
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => { setIsInactive(true); handleLogout(); }, INACTIVITY_TIMEOUT);
    };
    const handleActivity = () => resetTimer();

    if (isFirebaseInitialized) {
      const unsubscribe = subscribeToAuth((currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
        if (currentUser) {
          loadData();
          window.addEventListener('mousemove', handleActivity);
          window.addEventListener('keydown', handleActivity);
          resetTimer();
        } else {
          window.removeEventListener('mousemove', handleActivity);
          window.removeEventListener('keydown', handleActivity);
          clearTimeout(inactivityTimer);
        }
      });
      return () => { unsubscribe(); window.removeEventListener('mousemove', handleActivity); window.removeEventListener('keydown', handleActivity); clearTimeout(inactivityTimer); };
    } else {
      const storedAuth = sessionStorage.getItem('ffa_auth_user');
      if (storedAuth) { setUser(JSON.parse(storedAuth)); loadData(); window.addEventListener('mousemove', handleActivity); window.addEventListener('keydown', handleActivity); resetTimer(); }
      setAuthLoading(false);
      return () => { window.removeEventListener('mousemove', handleActivity); window.removeEventListener('keydown', handleActivity); clearTimeout(inactivityTimer); };
    }
  }, [handleLogout]);

  const loadData = async () => { setDataLoading(true); try { const data = await getScholarships(); setScholarships(data); } finally { setDataLoading(false); } };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError(''); setIsLoggingIn(true);
    try {
      const userCredential = await loginAdmin(email, password);
      if (!isFirebaseInitialized) { setUser(userCredential.user); sessionStorage.setItem('ffa_auth_user', JSON.stringify(userCredential.user)); loadData(); }
    } catch (error: any) {
      let msg = 'Failed to sign in.';
      if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      else if (error.message) msg = error.message;
      setLoginError(msg);
    } finally { setIsLoggingIn(false); }
  };

  const isValidUrl = (urlString: string) => { try { return Boolean(new URL(urlString)); } catch { return false; } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUrl(formData.externalLink)) { alert('Please enter a valid External Link URL.'); return; }
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) { alert('Please enter a valid Image URL.'); return; }
    setDataLoading(true);
    try {
      if (editingId) await updateScholarship(editingId, formData);
      else await createScholarship(formData);
      setIsFormOpen(false); setEditingId(null); setFormData(INITIAL_FORM); await loadData();
    } catch (error) { console.error(error); alert('Operation failed'); }
    finally { setDataLoading(false); }
  };

  const openEdit = (scholarship: Scholarship) => {
    setFormData({ title: scholarship.title, provider: scholarship.provider, degree: Array.isArray(scholarship.degree) ? scholarship.degree : [scholarship.degree], fundingAmount: scholarship.fundingAmount, deadline: scholarship.deadline, location: scholarship.location, externalLink: scholarship.externalLink, imageUrl: scholarship.imageUrl || '', description: scholarship.description });
    setEditingId(scholarship.id); setIsFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return; setDataLoading(true);
    try { await deleteScholarship(deleteId); await loadData(); }
    catch (error) { console.error("Delete failed", error); alert("Failed to delete scholarship"); }
    finally { setDataLoading(false); setDeleteId(null); }
  };

  const handleDegreeChange = (degree: string) => { setFormData(prev => ({ ...prev, degree: prev.degree.includes(degree) ? prev.degree.filter(d => d !== degree) : [...prev.degree, degree] })); };

  const handleScrapePost = async (items: ScholarshipFormData[]) => {
    setDataLoading(true);
    try {
      for (const item of items) { await createScholarship(item); }
      await loadData();
    } catch (error) { console.error("Error posting scraped scholarships:", error); alert("Failed to post some scholarships."); }
    finally { setDataLoading(false); setIsScrapeModalOpen(false); }
  };

  if (authLoading) return (<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 darker:bg-black"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>);

  // Login View
  if (!user) return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 darker:bg-black px-4 pt-20 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 darker:bg-zinc-950 p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-200 dark:border-slate-700 darker:border-zinc-800">
        <div className="flex justify-center mb-6"><div className="bg-emerald-50 dark:bg-emerald-900/30 darker:bg-emerald-900/20 p-4 rounded-2xl"><Shield className="text-emerald-600 dark:text-emerald-400" size={32} /></div></div>
        <h2 className="font-heading text-2xl font-bold text-center text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-2">Admin Portal</h2>
        <p className="text-slate-500 dark:text-slate-400 darker:text-zinc-400 text-center mb-8 text-sm">{isFirebaseInitialized ? "Sign in with your authorized credentials." : "Demo Mode: Use admin@fundedfuturesafrica.com / sudoAfrica!"}</p>
        {isInactive && (<div className="bg-amber-50 dark:bg-amber-900/20 darker:bg-amber-900/10 text-amber-700 dark:text-amber-400 text-sm p-3 rounded-xl flex items-start gap-2 mb-4 border border-amber-200 dark:border-amber-800 darker:border-amber-900/50"><AlertTriangle size={16} className="mt-0.5 flex-shrink-0" /><span>You have been logged out due to inactivity.</span></div>)}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 darker:text-zinc-400 uppercase tracking-wider">Email</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setLoginError(''); }} className="input-base pl-10" placeholder="admin@fundedfuturesafrica.com" /></div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 darker:text-zinc-400 uppercase tracking-wider">Password</label>
            <div className="relative"><Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setLoginError(''); }} className="input-base pl-10" placeholder="••••••••" /></div>
          </div>
          {loginError && (<div className="bg-red-50 dark:bg-red-900/20 darker:bg-red-900/10 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl flex items-start gap-2 border border-red-200 dark:border-red-800 darker:border-red-900/50"><AlertTriangle size={16} className="mt-0.5 flex-shrink-0" /><span>{loginError}</span></div>)}
          <button type="submit" disabled={isLoggingIn} className="w-full btn-primary justify-center py-3.5">{isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}</button>
        </form>
        {!isFirebaseInitialized && (<div className="mt-6 text-center"><span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 darker:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 darker:border-amber-900/50"><HardDrive size={12} /> Running in Demo Mode</span></div>)}
      </div>
    </div>
  );

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 darker:bg-black pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-3xl font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">Scholarship Manager</h1>
              {isFirebaseInitialized ? (<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 darker:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 darker:border-emerald-800/50"><Database size={12} /> Live Database</span>) : (<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 darker:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 darker:border-amber-900/50"><HardDrive size={12} /> Demo Mode</span>)}
            </div>
            <p className="text-slate-500 dark:text-slate-400 darker:text-zinc-400">Welcome, {user.email}. Manage your scholarship listings.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto flex-wrap">
            <button onClick={() => setIsScrapeModalOpen(true)} className="btn-secondary flex-1 md:flex-none"><Radar size={18} /> Scrape</button>
            <button onClick={handleLogout} className="btn-secondary flex-1 md:flex-none"><LogOut size={18} /> Logout</button>
            <button onClick={() => { setEditingId(null); setFormData(INITIAL_FORM); setIsFormOpen(true); }} className="btn-primary flex-1 md:flex-none"><Plus size={18} /> Add New</button>
          </div>
        </div>

        {dataLoading && !isFormOpen && !deleteId ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map(scholarship => (<ScholarshipCard key={scholarship.id} data={scholarship} adminMode onEdit={() => openEdit(scholarship)} onDelete={() => setDeleteId(scholarship.id)} />))}
          </div>
        )}

        {/* Delete Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 darker:bg-zinc-950 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 darker:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="text-red-600 dark:text-red-400" size={24} /></div>
                <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100 mb-2">Delete Scholarship?</h3>
                <p className="text-slate-500 dark:text-slate-400 darker:text-zinc-400 text-sm mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 btn-secondary text-sm">Cancel</button>
                  <button onClick={confirmDelete} className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-all flex justify-center items-center" disabled={dataLoading}>{dataLoading ? <Loader2 className="animate-spin" size={18} /> : 'Delete'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 darker:bg-zinc-950 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 darker:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 darker:bg-zinc-950 z-10">
                <h2 className="font-heading text-xl font-bold text-slate-800 dark:text-slate-100 darker:text-zinc-100">{editingId ? 'Edit Scholarship' : 'Add New Scholarship'}</h2>
                <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 darker:hover:bg-zinc-800 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300">Scholarship Title</label><input required className="input-base" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Pan-African Excellence" /></div>
                  <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300">Provider</label><input required className="input-base" value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value })} placeholder="e.g. African Union" /></div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300">Degree Types</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                      {DEGREE_OPTIONS.map(degree => (<label key={degree} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 darker:text-zinc-400 cursor-pointer"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600/20" checked={formData.degree.includes(degree)} onChange={() => handleDegreeChange(degree)} />{degree}</label>))}
                    </div>
                  </div>
                  <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300">Deadline</label><input type="date" required className="input-base" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} /></div>
                  <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300">Funding Amount</label><input required className="input-base" value={formData.fundingAmount} onChange={e => setFormData({ ...formData, fundingAmount: e.target.value })} placeholder="e.g. Full Tuition + $1000 Stipend" /></div>
                  <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300">Location</label><input required className="input-base" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Nairobi, Kenya" /></div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300">Image URL (Optional)</label>
                    <input className="input-base" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://images.unsplash.com/..." />
                    {formData.imageUrl && !isValidUrl(formData.imageUrl) && <p className="text-red-500 text-xs mt-1">Please enter a valid URL.</p>}
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300">External Application Link</label>
                    <input type="url" required className="input-base" value={formData.externalLink} onChange={e => setFormData({ ...formData, externalLink: e.target.value })} placeholder="https://..." />
                    {formData.externalLink && !isValidUrl(formData.externalLink) && <p className="text-red-500 text-xs mt-1">Please enter a valid URL.</p>}
                  </div>
                  <div className="md:col-span-2 space-y-1.5"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300 darker:text-zinc-300">Description</label><textarea required rows={4} className="input-base resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief summary of the scholarship..." /></div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 darker:border-zinc-800">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 btn-secondary">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary justify-center" disabled={dataLoading}>{dataLoading && <Loader2 className="animate-spin" size={18} />}{editingId ? 'Update Scholarship' : 'Create Scholarship'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Scrape Modal */}
        {isScrapeModalOpen && <ScrapeModal onClose={() => setIsScrapeModalOpen(false)} onPost={handleScrapePost} />}
      </div>
    </div>
  );
};

export default AdminPage;
