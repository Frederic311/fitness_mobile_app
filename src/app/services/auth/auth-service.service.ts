import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '@firebase/auth';
import { Firestore, doc, setDoc, getDoc, DocumentSnapshot, updateDoc } from '@angular/fire/firestore';

export interface Users {
  name: string;
  email: string;
  nickname?: string;
  phoneNumber?: string;
  profilePicture?: string;
  bannerImage?: string;
  role?: string;
  age?: number;
  height?: number;
  weight?: number;
  sportsLevel?: string;
  sportsCriteria?: string[];
  description?: string;
  sessionPrice?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private ngFireAuth: AngularFireAuth,
    private firestore: Firestore
  ) {}

  // Register a new user and save profile data in Firestore
  async registerUser(email: string, password: string, name: string): Promise<User | null> {
    try {
      const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        await this.saveUserProfile(user.uid, { name, email });
      }
      return user as User;
    } catch (error: any) {
      console.error('Error registering user:', error.message || error);
      throw error;
    }
  }

  // Log in an existing user
  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await this.ngFireAuth.signInWithEmailAndPassword(email, password);
      return userCredential.user as User;
    } catch (error: any) {
      console.error('Error logging in user:', error.message || error);
      throw error;
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await this.ngFireAuth.sendPasswordResetEmail(email);
    } catch (error: any) {
      console.error('Error sending password reset email:', error.message || error);
      throw error;
    }
  }

  // Get the currently logged-in user's profile
  async getProfile(): Promise<User | null> {
    return new Promise<User | null>((resolve, reject) => {
      this.ngFireAuth.onAuthStateChanged(
        (user) => resolve(user as User | null),
        (error) => {
          console.error('Error fetching profile:', error);
          reject(error);
        }
      );
    });
  }

  // Sign out the user
  async signOut(): Promise<void> {
    try {
      await this.ngFireAuth.signOut();
    } catch (error: any) {
      console.error('Error signing out:', error.message || error);
      throw error;
    }
  }

  // Save user profile to Firestore
  async saveUserProfile(uid: string, profileData: Users): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, profileData);
    } catch (error: any) {
      console.error('Error saving user profile:', error.message || error);
      throw error;
    }
  }

  // Update user role in Firestore
  async updateUserRole(uid: string, role: string): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userDocRef, { role });
    } catch (error: any) {
      console.error('Error updating user role:', error.message || error);
      throw error;
    }
  }

  // Update user sports level and criteria in Firestore
  async updateUserSports(uid: string, sportsLevel: string, sportsCriteria: string[]): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userDocRef, { sportsLevel, sportsCriteria });
    } catch (error: any) {
      console.error('Error updating user sports data:', error.message || error);
      throw error;
    }
  }

  // Update user details in Firestore
  async updateUserDetails(uid: string, details: Partial<Users>): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userDocRef, details);
    } catch (error: any) {
      console.error('Error updating user details:', error.message || error);
      throw error;
    }
  }

  // Fetch user profile from Firestore
  async fetchUserProfile(uid: string): Promise<Users | null> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDoc: DocumentSnapshot = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data() as Users;
      } else {
        console.warn('User profile not found for UID:', uid);
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message || error);
      throw error;
    }
  }
}
