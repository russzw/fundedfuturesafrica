
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDoc,
  Firestore,
  orderBy,
  query,
  Timestamp // Import Timestamp
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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

export let isFirebaseInitialized = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
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

  if (email.toLowerCase() === 'admin@fundedfuturesafrica.com' && password === 'sudoAfrica!') {
    console.log("Authenticated with demo credentials.");
    return { user: { email: 'admin@fundedfuturesafrica.com', uid: 'demo-admin-user' } };
  }

  throw new Error("Invalid credentials for demo mode.");
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
  return () => {};
};

// --- DATA CONVERSION HELPER ---
const mapFirebaseDocToScholarship = (doc: any): Scholarship => {
  const data = doc.data();
  // Firestore's Timestamp object needs to be converted to a number (milliseconds)
  // to match the structure used throughout the app (Date.now())
  if (data.createdAt && data.createdAt instanceof Timestamp) {
    data.createdAt = data.createdAt.toMillis();
  }
  return { id: doc.id, ...data } as Scholarship;
};


// --- MOCK DATA FOR DEMO ---
const MOCK_DATA: Scholarship[] = [
  {
    id: '1',
    title: 'Pan-African Excellence Award',
    provider: 'African Union Foundation',
    degree: ['Masters'],
    fundingAmount: 'Full Tuition + Stipend',
    deadline: '2024-05-30',
    location: 'Addis Ababa, Ethiopia',
    externalLink: 'https://au.int',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    description: 'A prestigious award for high-achieving students across the continent looking to pursue postgraduate studies in development sciences.',
    createdAt: Date.now()
  },
];

// --- DATABASE SERVICE METHODS ---

export const getScholarships = async (): Promise<Scholarship[]> => {
  if (!isFirebaseInitialized) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
    return getLocalScholarships();
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    // Use the helper to correctly map the data
    return querySnapshot.docs.map(mapFirebaseDocToScholarship);
  } catch (e) {
    console.error("Error fetching from Firebase:", e);
    return getLocalScholarships(); // Fallback
  }
};

export const getScholarshipById = async (id: string): Promise<Scholarship | null> => {
  if (isFirebaseInitialized && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return mapFirebaseDocToScholarship(docSnap);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      return getLocalScholarshipById(id); // Fallback to local
    }
  } else {
    return getLocalScholarshipById(id);
  }
};

export const createScholarship = async (data: ScholarshipFormData): Promise<void> => {
  if (isFirebaseInitialized && db) {
    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("Error creating in Firebase:", error);
      throw error; // Re-throw to be handled by the calling UI
    }
  } else {
    await createLocalScholarship(data);
  }
};

export const updateScholarship = async (id: string, data: Partial<ScholarshipFormData>): Promise<void> => {
  if (isFirebaseInitialized && db) {
    try {
      const scholarshipRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(scholarshipRef, data);
    } catch (error) {
      console.error("Error updating in Firebase:", error);
      throw error; // Re-throw
    }
  } else {
    await updateLocalScholarship(id, data);
  }
};

export const deleteScholarship = async (id: string): Promise<void> => {
  if (isFirebaseInitialized && db) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting from Firebase:", error);
      throw error; // Re-throw
    }
  } else {
    await deleteLocalScholarship(id);
  }
};

// --- LOCAL STORAGE HELPERS (FALLBACK) ---

const safelyGetLocalStorage = (): Scholarship[] => {
  if (typeof window === 'undefined') return MOCK_DATA;

  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!storedData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  }

  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing local storage data:", error);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  }
};

const getLocalScholarships = (): Scholarship[] => {
  return safelyGetLocalStorage();
};

const getLocalScholarshipById = (id: string): Scholarship | null => {
  const scholarships = safelyGetLocalStorage();
  return scholarships.find(s => s.id === id) || null;
};

const createLocalScholarship = async (data: ScholarshipFormData): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate latency
  const currentScholarships = safelyGetLocalStorage();
  const newScholarship: Scholarship = {
    ...data,
    id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // More robust ID
    createdAt: Date.now(),
  };
  const updatedScholarships = [newScholarship, ...currentScholarships];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedScholarships));
};

const updateLocalScholarship = async (id: string, data: Partial<ScholarshipFormData>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate latency
  const currentScholarships = safelyGetLocalStorage();
  const updatedScholarships = currentScholarships.map(s =>
    s.id === id ? { ...s, ...data } : s
  );
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedScholarships));
};

const deleteLocalScholarship = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate latency
  const currentScholarships = safelyGetLocalStorage();
  const updatedScholarships = currentScholarships.filter(s => s.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedScholarships));
};
