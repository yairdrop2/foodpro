import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  stripeCustomerId?: string;
  createdAt: any;
  updatedAt: any;
}

export const authService = {
  // Register new user
  async register(email: string, password: string, name: string): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: Omit<UserProfile, 'id'> = {
        email: user.email!,
        name,
        isPremium: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      return {
        id: user.uid,
        ...userProfile,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register user');
    }
  },

  // Sign in user
  async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      return {
        id: user.uid,
        ...userData
      } as UserProfile;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  },

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();
      return {
        id: userId,
        ...userData
      } as UserProfile;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  },

  // Update premium status
  async updatePremiumStatus(userId: string, isPremium: boolean, stripeCustomerId?: string): Promise<void> {
    try {
      const updateData: any = {
        isPremium,
        updatedAt: serverTimestamp()
      };

      if (stripeCustomerId) {
        updateData.stripeCustomerId = stripeCustomerId;
      }

      await updateDoc(doc(db, 'users', userId), updateData);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update premium status');
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};