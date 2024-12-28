import { Component, OnInit } from '@angular/core';
import { AuthService, Session, Users } from '../../../services/auth/auth-service.service';
import { BookingService } from '../../../services/booking/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
  styleUrls: ['./main-user.page.scss'],
})
export class MainUserPage implements OnInit {
  user: Users | null = null;
  sessions: Session[] = [];
  coaches: Users[] = [];
  totalDistance: number = 0;
  totalDuration: number = 0;

  constructor(private authService: AuthService, private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getProfile().then(user => {
      if (user && user.uid) {
        this.authService.fetchUserProfile(user.uid).then(profile => {
          this.user = profile;
          this.totalDistance = profile?.totalDistance || 0;
          this.totalDuration = profile?.totalDuration || 0;
        }).catch(error => {
          console.error('Error fetching user profile:', error);
        });
        this.loadCoaches();
      }
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }

  loadCoaches(): void {
    this.authService.fetchCoaches().then(coaches => {
      this.coaches = coaches; // Assign all coaches to the coaches array
    }).catch(error => {
      console.error('Error fetching coaches:', error);
    });
  }
  loadSessions(userEmail: string): void { 
    this.bookingService.fetchSessions(userEmail).then(sessions => { 
      this.sessions = sessions; }).catch(error => 
        { console.error('Error fetching sessions:', error); }); }

  async bookSession(coachEmail: string): Promise<void> {
    if (this.user && this.user.name && this.user.email && this.user.profilePicture) {
      try {
        await this.bookingService.bookSession(coachEmail, this.user.name, this.user.email, this.user.profilePicture);
        console.log(`Booking session with coach email: ${coachEmail}`);
        this.presentToast('Session booked successfully');
      } catch (error) {
        console.error('Error booking session:', error);
        this.presentToast('Error booking session. Please try again.');
      }
    } else {
      this.presentToast('User information is missing. Please log in again.');
    }
  }

  async presentToast(message: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    toast.position = 'top';

    document.body.appendChild(toast);
    await toast.present();
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['/landing']);
    });
  }
}
