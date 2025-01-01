import { Component, OnInit } from '@angular/core';
import { AuthService, Session, Users } from '../../../services/auth/auth-service.service';
import { BookingService } from '../../../services/booking/booking.service';
import { Router } from '@angular/router';
import { Pedometer } from '@ionic-native/pedometer/ngx';

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
  steps: number = 0;
  distance: number = 0;
  startTime: number = 0;
  sessionDuration: number = 0;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router,
    private pedometer: Pedometer
  ) {}

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

    this.startPedometer();
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
      this.sessions = sessions;
    }).catch(error => {
      console.error('Error fetching sessions:', error);
    });
  }

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
      this.router.navigate(['/login']);
    });
  }

  startPedometer() {
    this.startTime = Date.now();
    this.pedometer.startPedometerUpdates()
      .subscribe((data) => {
        this.steps = data.numberOfSteps;
        this.distance = this.steps * 0.0008; // Assuming average step length of 0.8 meters
        this.sessionDuration = (Date.now() - this.startTime) / (1000 * 60 * 60); // Duration in hours
        this.totalDuration += this.sessionDuration;
        this.startTime = Date.now(); // Reset start time for next session
      });
  }
}
