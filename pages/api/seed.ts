
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Firestore } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ScholarshipFormData } from '../../types';

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

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.log("✅ Firebase connected successfully");
  } else {
    console.warn("⚠️ Firebase config missing. Cannot connect to Firebase.");
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}

const COLLECTION_NAME = 'scholarships';

const dummyScholarships: ScholarshipFormData[] = [
  {
    title: 'Tech Innovators Scholarship',
    provider: 'Codecademy',
    degree: 'Certificate',
    fundingAmount: '$5,000',
    deadline: '2024-08-15',
    location: 'Remote',
    externalLink: 'https://www.codecademy.com/',
    description: 'For aspiring developers and tech entrepreneurs.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Future Leaders Grant',
    provider: 'Google',
    degree: 'Bachelors',
    fundingAmount: '$10,000',
    deadline: '2024-09-01',
    location: 'USA',
    externalLink: 'https://buildyourfuture.withgoogle.com/scholarships',
    description: 'Supporting underrepresented students in computer science.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Young African Scholars Program',
    provider: 'Mastercard Foundation',
    degree: 'Masters',
    fundingAmount: 'Full Coverage',
    deadline: '2024-07-31',
    location: 'Various African Universities',
    externalLink: 'https://mastercardfdn.org/all-stories/mastercard-foundation-scholars-program-the-next-chapter/',
    description: 'For academically talented yet economically disadvantaged students in Africa.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Women in STEM Scholarship',
    provider: 'Microsoft',
    degree: 'PhD',
    fundingAmount: '$20,000',
    deadline: '2024-10-10',
    location: 'Global',
    externalLink: 'https://careers.microsoft.com/us/en/codess-scholarship',
    description: 'Empowering women to pursue careers in Science, Technology, Engineering, and Math.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Art & Design Bursary',
    provider: 'Adobe',
    degree: 'Associates',
    fundingAmount: '$2,500',
    deadline: '2024-06-30',
    location: 'Online',
    externalLink: 'https://www.adobe.com/about-adobe/issues/creative-residency.html',
    description: 'Supporting the next generation of artists and designers.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Environmental Sustainability Award',
    provider: 'United Nations',
    degree: 'Post-doctoral',
    fundingAmount: 'Research Grant',
    deadline: '2024-11-01',
    location: 'International',
    externalLink: 'https://www.un.org/',
    description: 'For research focused on climate change and environmental protection.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    if (!db) {
      res.status(500).json({ error: 'Database not initialized' });
      return;
    }

    try {
      for (const scholarship of dummyScholarships) {
        await addDoc(collection(db, COLLECTION_NAME), {
          ...scholarship,
          createdAt: Date.now(),
        });
      }
      res.status(200).json({ message: 'Database seeded successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error seeding database' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
