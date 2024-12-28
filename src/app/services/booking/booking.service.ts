import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Session, Users } from '../auth/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private firestore: Firestore) { }

  // Fetch all reservations for a coach by email from Firestore
  async fetchReservations(coachEmail: string): Promise<any[]> {
    try {
      const coachQuery = query(collection(this.firestore, 'users'), where('email', '==', coachEmail));
      const querySnapshot = await getDocs(coachQuery);

      if (querySnapshot.empty) {
        throw new Error('Coach profile not found');
      }

      const coachDoc = querySnapshot.docs[0];
      const coachData = coachDoc.data() as Users;

      return coachData.reservations || [];
    } catch (error: any) {
      console.error('Error fetching reservations:', error.message || error);
      throw error;
    }
  }

  // Book a session with a coach
  async bookSession(coachEmail: string, userName: string, userEmail: string, userProfilePicture: string): Promise<void> {
    try {
      const coachQuery = query(collection(this.firestore, 'users'), where('email', '==', coachEmail));
      const querySnapshot = await getDocs(coachQuery);

      if (querySnapshot.empty) {
        throw new Error('Coach profile not found');
      }

      const coachDocRef = querySnapshot.docs[0].ref;
      const coachData = querySnapshot.docs[0].data() as Users;

      const newReservation = {
        userName,
        userEmail,
        userProfilePicture,
        sessionDate: new Date().toISOString().split('T')[0],
        sessionTime: new Date(Date.now() + 86400000).toISOString().split('T')[1].split('.')[0] // +1 day
      };

      const updatedReservations = coachData.reservations ? [...coachData.reservations, newReservation] : [newReservation];

      await updateDoc(coachDocRef, { reservations: updatedReservations });
    } catch (error: any) {
      console.error('Error booking session:', error.message || error);
      throw error;
    }
  }

  // Fetch all sessions for a user
  async fetchSessions(userEmail: string): Promise<Session[]> {
    try {
      const sessionsQuery = query(collection(this.firestore, 'sessions'), where('userEmail', '==', userEmail));
      const querySnapshot = await getDocs(sessionsQuery);
      const sessions: Session[] = []; querySnapshot.forEach((doc) => { sessions.push(doc.data() as Session); });
      return sessions;
    }
    catch (error: any) { console.error('Error fetching sessions:', error.message || error); throw error; }
  }
}
