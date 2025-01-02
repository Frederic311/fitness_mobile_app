import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../services/booking/booking.service';
import { Session } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-session-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  coachId: string;
  coachEmail: string;
  sessionDetails: Session;

  constructor(private route: ActivatedRoute, private bookingService: BookingService, private router: Router) {}

  ngOnInit() {
    this.coachId = this.route.snapshot.paramMap.get('coachId') || '';
    console.log('coachId:', this.coachId);
    if (this.coachId) {
      this.loadCoachEmailAndSessionDetails();
    } else {
      console.error('coachId is null');
    }
  }

  async loadCoachEmailAndSessionDetails() {
    try {
      const coach = await this.bookingService.fetchCoachById(this.coachId);
      this.coachEmail = coach.email;
      console.log('coachEmail:', this.coachEmail);
      const sessions = await this.bookingService.fetchSessionsByCoachEmail(this.coachEmail);
      this.sessionDetails = sessions.find(session => session.coachEmail === this.coachEmail) || {} as Session;
      console.log('sessionDetails:', this.sessionDetails);
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  }

  viewExercise(index: number): void {
    console.log('viewExercise called with index:', index);
    if (this.sessionDetails && this.sessionDetails.exercises[index]) {
      const exercise = this.sessionDetails.exercises[index];
      console.log('Navigating to exercise with details:', exercise);
      this.router.navigate(['/exercise'], { state: { exercise } });
    } else {
      console.error('Invalid exercise index');
    }
  }
}