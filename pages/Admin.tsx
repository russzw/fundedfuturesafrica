import React, { useState, useEffect } from 'react';
import { Lock, Plus, X, Loader2, LogOut, AlertTriangle, Trash2, Database, HardDrive, Mail, Key } from 'lucide-react';
import { 
  getScholarships, 
  createScholarship, 
  updateScholarship, 
  deleteScholarship, 
  isFirebaseInitialized,
  loginAdmin,
  logoutAdmin,
  subscribeToAuth
} from '../services/firebase';
import { Scholarship, ScholarshipFormData } from '../types';
import { ScholarshipCard } from '../components/ScholarshipCard';

const INITIAL_FORM: ScholarshipFormData = {
  title: '',
  provider: '',
  degree: 'Masters',
  fundingAmount: '',
  deadline: '',
  location: '',
  externalLink: '',
  imageUrl: '',
  description: ''
};

export const Admin: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data State
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ScholarshipFormData>(INITIAL_FORM);

  // Initialize Auth Listener
  useEffect(() => {
    // If Firebase is active, we listen to the real auth state
    if (isFirebaseInitialized) {
      const unsubscribe = subscribeToAuth((currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
        if (currentUser) {
          loadData();
        }
      });
      return () => unsubscribe();
    } else {
      // Fallback for Demo Mode: Check sessionStorage
      const storedAuth = sessionStorage.getItem('ffa_auth_user');
      if (storedAuth) {
        setUser(JSON.parse(storedAuth));
        loadData();
      }
      setAuthLoading(false);
    }
  }, []);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const data = await getScholarships();
      setScholarships(data);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const userCredential = await loginAdmin(email, password);
      // If Firebase is initialized, the onAuthStateChanged listener will handle state update.
      // If NOT initialized (Demo Mode), we need to set it manually.
      if (!isFirebaseInitialized) {
        setUser(userCredential.user);
        sessionStorage.setItem('ffa_auth_user', JSON.stringify(userCredential.user));
        loadData();
      }
    } catch (error: any) {
      console.error(error);
      let msg = 'Failed to sign in.';
      if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      else if (error.message) msg = error.message;
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setUser(null);
    setScholarships([]);
    if (!isFirebaseInitialized) {
      sessionStorage.removeItem('ffa_auth_user');
    }
  };

  const isValidUrl = (urlString: string) => {
    try { 
      return Boolean(new URL(urlString)); 
    }
    catch(e){ 
      return false; 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!isValidUrl(formData.externalLink)) {
      alert('Please enter a valid External Link URL (e.g., https://example.com)');
      return;
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      alert('Please enter a valid Image URL (e.g., https://example.com/image.jpg)');
      return;
    }

    setDataLoading(true);
    try {
      if (editingId) {
        await updateScholarship(editingId, formData);
      } else {
        await createScholarship(formData);
      }
      setIsFormOpen(false);
      setEditingId(null);
      setFormData(INITIAL_FORM);
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    } finally {
      setDataLoading(false);
    }
  };

  const openEdit = (item: Scholarship) => {
    setFormData({
      title: item.title,
      provider: item.provider,
      degree: item.degree,
      fundingAmount: item.fundingAmount,
      deadline: item.deadline,
      location: item.location,
      externalLink: item.externalLink,
      imageUrl: item.imageUrl || '',
      description: item.description
    });
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const initiateDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    setDataLoading(true);
    try {
      await deleteScholarship(deleteId);
      await loadData();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete scholarship");
    } finally {
      setDataLoading(false);
      setDeleteId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  // Login View
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-100 p-3 rounded-full">
              <Lock className="text-brand-600" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Admin Portal</h2>
          <p className="text-slate-500 text-center mb-8">
            {isFirebaseInitialized 
              ? "Sign in with your authorized email." 
              : "Demo Mode: Use any email and 'admin123'"}
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  placeholder="admin@fundedfutures.com"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-start gap-2 animate-pulse">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-brand-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-700 transition-all active:scale-[0.99] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>
          
          {!isFirebaseInitialized && (
             <div className="mt-6 text-center">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  <HardDrive size={12} />
                  Running in Demo Mode
               </span>
             </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-slate-900">Scholarship Manager</h1>
              {isFirebaseInitialized ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  <Database size={12} />
                  Live Database
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200" title="Add Firebase keys to .env to connect">
                  <HardDrive size={12} />
                  Local Demo Mode
                </span>
              )}
            </div>
            <p className="text-slate-500">Welcome, {user.email}. Manage your global scholarship listings.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <button
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData(INITIAL_FORM);
                setIsFormOpen(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition-colors shadow-sm"
            >
              <Plus size={18} />
              Add New
            </button>
          </div>
        </div>

        {dataLoading && !isFormOpen && !deleteId ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-600" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scholarships.map(scholarship => (
              <ScholarshipCard 
                key={scholarship.id} 
                data={scholarship} 
                adminMode 
                onEdit={() => openEdit(scholarship)}
                onDelete={() => initiateDelete(scholarship.id)}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 transform transition-all">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Scholarship?</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Are you sure you want to delete this scholarship? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex justify-center items-center"
                    disabled={dataLoading}
                  >
                    {dataLoading ? <Loader2 className="animate-spin" size={18} /> : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Create Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId ? 'Edit Scholarship' : 'Add New Scholarship'}
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Scholarship Title</label>
                    <input
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-shadow"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Pan-African Excellence"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Provider</label>
                    <input
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-shadow"
                      value={formData.provider}
                      onChange={e => setFormData({...formData, provider: e.target.value})}
                      placeholder="e.g. African Union"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Degree Type</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-shadow bg-white"
                      value={formData.degree}
                      onChange={e => setFormData({...formData, degree: e.target.value})}
                    >
                      <option value="High School">High School</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelors">Bachelors</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                      <option value="Post-Doc">Post-Doc</option>
                      <option value="Fellowship">Fellowship</option>
                      <option value="Vocational">Vocational</option>
                      <option value="Research">Research</option>
                      <option value="Internship">Internship</option>
                      <option value="Bootcamp">Bootcamp</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Deadline</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-shadow"
                      value={formData.deadline}
                      onChange={e => setFormData({...formData, deadline: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Funding Amount</label>
                    <input
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-shadow"
                      value={formData.fundingAmount}
                      onChange={e => setFormData({...formData, fundingAmount: e.target.value})}
                      placeholder="e.g. Full Tuition + $1000 Stipend"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Location</label>
                    <input
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-shadow"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Nairobi, Kenya"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Image URL (Optional)</label>
                    <input
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-shadow"
                      value={formData.imageUrl}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                    />
                    {formData.imageUrl && !isValidUrl(formData.imageUrl) && (
                      <p className="text-red-500 text-xs mt-1">Please enter a valid URL.</p>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">External Application Link</label>
                    <input
                      type="url"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-shadow"
                      value={formData.externalLink}
                      onChange={e => setFormData({...formData, externalLink: e.target.value})}
                      placeholder="https://..."
                    />
                     {formData.externalLink && !isValidUrl(formData.externalLink) && (
                      <p className="text-red-500 text-xs mt-1">Please enter a valid URL.</p>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none resize-none transition-shadow"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief summary of the scholarship..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium flex justify-center items-center gap-2 transition-colors"
                    disabled={dataLoading}
                  >
                    {dataLoading && <Loader2 className="animate-spin" size={18} />}
                    {editingId ? 'Update Scholarship' : 'Create Scholarship'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};