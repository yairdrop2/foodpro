import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  avatar?: string;
  createdAt: Date;
  stripeCustomerId?: string;
}

export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();
    
    return {
      id: firebaseUser.uid,
      name: userData?.name || firebaseUser.displayName || 'User',
      email: firebaseUser.email!,
      isPremium: userData?.isPremium || false,
      avatar: userData?.avatar || firebaseUser.photoURL,
      createdAt: userData?.createdAt?.toDate() || new Date(),
      stripeCustomerId: userData?.stripeCustomerId
    };
  },

  // Register new user
  async register(name: string, email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update profile
    await updateProfile(firebaseUser, { displayName: name });
    
    // Create user document in Firestore
    const userData = {
      name,
      email,
      isPremium: false,
      createdAt: new Date(),
      avatar: null,
      stripeCustomerId: null
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    
    return {
      id: firebaseUser.uid,
      name,
      email,
      isPremium: false,
      avatar: undefined,
      createdAt: new Date()
    };
  },

  // Sign out
  async signOut(): Promise<void> {
    await signOut(auth);
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          const user: User = {
            id: firebaseUser.uid,
            name: userData?.name || firebaseUser.displayName || 'User',
            email: firebaseUser.email!,
            isPremium: userData?.isPremium || false,
            avatar: userData?.avatar || firebaseUser.photoURL,
            createdAt: userData?.createdAt?.toDate() || new Date(),
            stripeCustomerId: userData?.stripeCustomerId
          };
          
          callback(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  // Update user premium status
  async updatePremiumStatus(userId: string, isPremium: boolean, stripeCustomerId?: string): Promise<void> {
    const updateData: any = { isPremium };
    if (stripeCustomerId) {
      updateData.stripeCustomerId = stripeCustomerId;
    }
    
    await setDoc(doc(db, 'users', userId), updateData, { merge: true });
  }
};