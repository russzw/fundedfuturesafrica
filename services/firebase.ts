import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Firestore,
  orderBy,
  query
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User, 
  Auth 
} from 'firebase/auth';
import { Scholarship, ScholarshipFormData } from '../types';

// --- CONFIGURATION ---

// Helper to safely access environment variables in various environments (Vite, CRA, Standard Node)
const getEnvVar = (name: string): string | undefined => {
  // Check process.env (Standard Node / Create React App)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[`REACT_APP_${name}`] || process.env[`VITE_${name}`] || process.env[name];
  }
  // Check import.meta.env (Vite standard)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[`VITE_${name}`] || import.meta.env[name];
    }
  } catch (e) {
    // Ignore errors if import.meta is not supported
  }
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY'),
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('FIREBASE_APP_ID')
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

export let isFirebaseInitialized = false;

// Attempt to initialize Firebase
try {
  if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseInitialized = true;
    console.log("✅ Firebase connected successfully");
  } else {
    console.warn("⚠️ Firebase config missing. Using LocalStorage fallback (Demo Mode).");
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}

const COLLECTION_NAME = 'scholarships';
const LOCAL_STORAGE_KEY = 'ffa_scholarships_data';

// --- AUTH SERVICE ---

export const loginAdmin = async (email: string, password: string) => {
  if (isFirebaseInitialized && auth) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  // FALLBACK FOR DEMO MODE
  // In a real app, you wouldn't have this hardcoded, but it's useful for the demo
  // if the user hasn't set up Firebase keys yet.
  if (password === 'admin123') {
    return { user: { email, uid: 'demo-user-123' } };
  }
  
  throw new Error("Invalid credentials. (Demo mode: use password 'admin123')");
};

export const logoutAdmin = async () => {
  if (isFirebaseInitialized && auth) {
    return signOut(auth);
  }
  return Promise.resolve();
};

export const subscribeToAuth = (callback: (user: User | { email: string; uid: string } | null) => void) => {
  if (isFirebaseInitialized && auth) {
    return onAuthStateChanged(auth, callback);
  }
  // Demo mode doesn't have a listener, so we return a no-op unsubscribe function.
  // The Admin component handles session storage for demo mode.
  return () => {};
};


// --- MOCK DATA FOR DEMO ---
const MOCK_DATA: Scholarship[] = [
  {
    id: '1',
    title: 'Pan-African Excellence Award',
    provider: 'African Union Foundation',
    degree: 'Masters',
    fundingAmount: 'Full Tuition + Stipend',
    deadline: '2024-05-30',
    location: 'Addis Ababa, Ethiopia',
    externalLink: 'https://au.int',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    description: 'A prestigious award for high-achieving students across the continent looking to pursue postgraduate studies in development sciences.',
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Tech Leaders of Tomorrow',
    provider: 'Global Tech Initiative',
    degree: 'Bachelors',
    fundingAmount: '$5,000 / year',
    deadline: '2024-06-15',
    location: 'Remote / Online',
    externalLink: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    description: 'Supporting the next generation of software engineers and data scientists in Africa. Includes laptop and internet stipend.',
    createdAt: Date.now() - 100000
  },
  {
    id: '3',
    title: 'Health Sciences Grant',
    provider: 'MediCorp Africa',
    degree: 'PhD',
    fundingAmount: 'Research Grant $15k',
    deadline: '2024-08-01',
    location: 'Cape Town, South Africa',
    externalLink: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    description: 'Funding for advanced research in public health and epidemiology. Open to all African nationals.',
    createdAt: Date.now() - 200000
  }
];

// --- DATABASE SERVICE METHODS ---

export const getScholarships = async (): Promise<Scholarship[]> => {
  if (isFirebaseInitialized && db) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scholarship));
      return data;
    } catch (e) {
      console.error("Error fetching from Firebase:", e);
      // Fallback only on error, or you could re-throw
      return getLocalScholarships();
    }
  }
  // Simulate network delay for realism in demo mode
  await new Promise(resolve => setTimeout(resolve, 600));
  return getLocalScholarships();
};

export const createScholarship = async (data: ScholarshipFormData): Promise<void> => {
  if (isFirebaseInitialized && db) {
    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: Date.now()
      });
      return;
    } catch (e) {
      console.error("Error creating in Firebase:", e);
      throw e;
    }
  }
  createLocalScholarship(data);
};

export const updateScholarship = async (id: string, data: Partial<ScholarshipFormData>): Promise<void> => {
  if (isFirebaseInitialized && db) {
    try {
      const scholarshipRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(scholarshipRef, data);
      return;
    } catch (e) {
      console.error("Error updating in Firebase:", e);
      throw e;
    }
  }
  updateLocalScholarship(id, data);
};

export const deleteScholarship = async (id: string): Promise<void> => {
  if (isFirebaseInitialized && db) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return;
    } catch (e) {
      console.error("Error deleting from Firebase:", e);
      throw e;
    }
  }
  deleteLocalScholarship(id);
};

// --- LOCAL STORAGE HELPERS (FALLBACK) ---

const getLocalScholarships = (): Scholarship[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  }
  return JSON.parse(stored);
};

const createLocalScholarship = (data: ScholarshipFormData) => {
  const current = getLocalScholarships();
  const newItem: Scholarship = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Date.now()
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newItem, ...current]));
};

const updateLocalScholarship = (id: string, data: Partial<ScholarshipFormData>) => {
  const current = getLocalScholarships();
  const updated = current.map(item => item.id === id ? { ...item, ...data } : item);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
};

const deleteLocalScholarship = (id: string) => {
  const current = getLocalScholarships();
  const filtered = current.filter(item => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
};