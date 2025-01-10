import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Exercise, Session, Users } from '../auth/auth-service.service';

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
      const coachId = querySnapshot.docs[0].id; // Get the coach ID

      const newReservation = {
        userName,
        userEmail,
        userProfilePicture,
        sessionDate: new Date().toISOString().split('T')[0],
        sessionTime: new Date(Date.now() + 86400000).toISOString().split('T')[1].split('.')[0], // +1 day
        coachId,// Store the coach ID

      };

      const updatedReservations = coachData.reservations ? [...coachData.reservations, newReservation] : [newReservation];

      await updateDoc(coachDocRef, { reservations: updatedReservations });

      // Update the user's document with the session field
      const userQuery = query(collection(this.firestore, 'users'), where('email', '==', userEmail));
      const userQuerySnapshot = await getDocs(userQuery);

      if (userQuerySnapshot.empty) {
        throw new Error('User profile not found');
      }

      const userDocRef = userQuerySnapshot.docs[0].ref;
      await updateDoc(userDocRef, { session: coachId });
    } catch (error: any) {
      console.error('Error booking session:', error.message || error);
      throw error;
    }
  }

   // Fetch all sessions for a user
   async fetchSessions(userEmail: string): Promise<any[]> {
    try {
      console.log('Fetching sessions for user:', userEmail);
      const userQuery = query(collection(this.firestore, 'users'), where('email', '==', userEmail));
      const userQuerySnapshot = await getDocs(userQuery);

      if (userQuerySnapshot.empty) {
        throw new Error('User profile not found');
      }

      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data() as Users;

      // Ensure sessions is always an array
      let sessions = userData.session;
      if (!Array.isArray(sessions)) {
        sessions = sessions ? [sessions] : [];
      }
      console.log('User sessions:', sessions);
      const acceptedSessions = [];

      for (const coachId of sessions) {
        console.log('Fetching coach data for coachId:', coachId);
        const coachQuery = query(collection(this.firestore, 'users'), where('__name__', '==', coachId));
        const coachQuerySnapshot = await getDocs(coachQuery);

        if (!coachQuerySnapshot.empty) {
          const coachDoc = coachQuerySnapshot.docs[0];
          const coachData = coachDoc.data() as Users;

          console.log('Coach data:', coachData);
          const userReservations = coachData.reservations?.filter(reservation => reservation.userEmail === userEmail && reservation.status === 'accepted') || [];
          console.log('User reservations:', userReservations);
          acceptedSessions.push(...userReservations);
        } else {
          console.log('No coach data found for coachId:', coachId);
        }
      }

      console.log('Accepted sessions:', acceptedSessions);
      return acceptedSessions;
    } catch (error: any) {
      console.error('Error fetching sessions:', error.message || error);
      throw error;
    }
  }
  // Update reservation status for a coach
  async updateReservationStatus(coachEmail: string, reservationIndex: number, status: string): Promise<void> {
    try {
      const coachQuery = query(collection(this.firestore, 'users'), where('email', '==', coachEmail));
      const querySnapshot = await getDocs(coachQuery);

      if (querySnapshot.empty) {
        throw new Error('Coach profile not found');
      }

      const coachDocRef = querySnapshot.docs[0].ref;
      const coachData = querySnapshot.docs[0].data() as Users;

      if (coachData.reservations && coachData.reservations[reservationIndex]) {
        coachData.reservations[reservationIndex].status = status;
        await updateDoc(coachDocRef, { reservations: coachData.reservations });
      } else {
        throw new Error('Reservation not found');
      }
    } catch (error: any) {
      console.error('Error updating reservation status:', error.message || error);
      throw error;
    }
  }

  // Fetch coach by ID
  async fetchCoachById(coachId: string): Promise<Users> {
    try {
      const coachQuery = query(collection(this.firestore, 'users'), where('__name__', '==', coachId));
      const querySnapshot = await getDocs(coachQuery);

      if (querySnapshot.empty) {
        throw new Error('Coach profile not found');
      }

      const coachDoc = querySnapshot.docs[0];
      return coachDoc.data() as Users;
    } catch (error: any) {
      console.error('Error fetching coach by ID:', error.message || error);
      throw error;
    }
  }

 // Fetch sessions by coach email
 async fetchSessionsByCoachEmail(coachEmail: string): Promise<Session[]> {
  try {
    const sessionsQuery = query(collection(this.firestore, 'sessions'), where('coachEmail', '==', coachEmail));
    const querySnapshot = await getDocs(sessionsQuery);

    const sessions: Session[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Session;
      data.sessionId = doc.id; // Assign the document ID to sessionId

      // Properly convert Firestore timestamp to JavaScript Date object
      if (data.startDateTime && (data.startDateTime as any).seconds) {
        data.startDateTime = new Date((data.startDateTime as any).seconds * 1000);
      }

      sessions.push(data);
    });
    return sessions;
  } catch (error: any) {
    console.error('Error fetching sessions:', error.message || error);
    throw error;
  }
}

  // Fetch exercise by ID
  async fetchExerciseById(exerciseId: string): Promise<Exercise> {
    try {
      const exerciseQuery = query(collection(this.firestore, 'exercises'), where('__name__', '==', exerciseId));
      const querySnapshot = await getDocs(exerciseQuery);

      if (querySnapshot.empty) {
        throw new Error('Exercise not found');
      }

      const exerciseDoc = querySnapshot.docs[0];
      return exerciseDoc.data() as Exercise;
    } catch (error: any) {
      console.error('Error fetching exercise by ID:', error.message || error);
      throw error;
    }
  }

// Update session status
async updateSessionStatus(sessionId: string, status: string): Promise<void> {
  try {
    const sessionDocRef = doc(this.firestore, 'sessions', sessionId);
    await updateDoc(sessionDocRef, { status });
  } catch (error: any) {
    console.error('Error updating session status:', error.message || error);
    throw error;
  }
}
}
