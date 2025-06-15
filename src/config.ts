import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBQf9s7kZrVHOfRjdIeEmiSQDB2gI4KTb4',
  authDomain: 'eatbuy-pos.firebaseapp.com',
  projectId: 'eatbuy-pos',
  storageBucket: 'eatbuy-pos.firebasestorage.app',
  messagingSenderId: '260158183333',
  appId: '1:260158183333:web:b24542931b251bb948ba4c',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
