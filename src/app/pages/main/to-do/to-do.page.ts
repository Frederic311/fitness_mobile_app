import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking/booking.service';
import { AuthService } from '../../../services/auth/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './to-do.page.html',
  styleUrls: ['./to-do.page.scss'],
})
export class ToDoPage implements OnInit {
  acceptedReservations: any[] = [];

  constructor(private bookingService: BookingService, private authService: AuthService, private router : Router) {}

  ngOnInit(): void {
    console.log('ToDoPage initialized');
    this.authService.getProfile().then(user => {
      if (user && user.email) {
        console.log('User profile fetched:', user);
        this.loadAcceptedReservations(user.email);
      } else {
        console.log('User profile not found or email is missing');
      }
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }

  loadAcceptedReservations(userEmail: string): void {
    console.log('Loading accepted reservations for user:', userEmail);
    this.bookingService.fetchSessions(userEmail).then(sessions => {
      console.log('Accepted reservations fetched:', sessions);
      this.acceptedReservations = sessions;
    }).catch(error => {
      console.error('Error fetching accepted reservations:', error);
    });
  }

  viewDetails(reservation: any): void {
    this.router.navigate(['/details', reservation.coachId]);
  }
}