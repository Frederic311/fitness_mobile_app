import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

export interface Users {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  async registerUser(email: string, password: string, name: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (user) {
        await this.saveUserProfile(user.uid, { name, email });
      }
      return user;
    } catch (error: any) {
      console.error('Error registering user:', error.message || error);
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Error logging in user:', error.message || error);
      throw error;
    }
  }

  async getProfile(): Promise<User | null> {
    return this.auth.currentUser;
  }

  private async saveUserProfile(uid: string, profileData: Users): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, profileData);
  }
}
