import { Component, OnInit } from '@angular/core';
import { AuthService, Users } from '../../../services/auth/auth-service.service';
import { BookingService } from '../../../services/booking/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-coach',
  templateUrl: './main-coach.page.html',
  styleUrls: ['./main-coach.page.scss'],
})
export class MainCoachPage implements OnInit {
  user: Users | null = null;
  reservations: any[] = [];

  constructor(private authService: AuthService, private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getProfile().then(user => {
      if (user && user.uid) {
        this.authService.fetchUserProfile(user.uid).then(profile => {
          this.user = profile;
          if (this.user && this.user.email) {
            this.loadReservations(this.user.email);
          }
        }).catch(error => {
          console.error('Error fetching user profile:', error);
        });
      }
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }

  loadReservations(coachEmail: string): void {
    this.bookingService.fetchReservations(coachEmail).then(reservations => {
      this.reservations = reservations;
    }).catch(error => {
      console.error('Error fetching reservations:', error);
    });
  }

  navigateToCoachSessions(): void {
    this.router.navigate(['/coach-session']);
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  acceptReservation(index: number): void {
    if (this.user && this.user.email) {
      this.bookingService.updateReservationStatus(this.user.email, index, 'accepted').then(() => {
        this.reservations[index].status = 'accepted';
      }).catch(error => {
        console.error('Error updating reservation status:', error);
      });
    }
  }
}
