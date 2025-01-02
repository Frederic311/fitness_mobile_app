import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking/booking.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  coachId: string;
  coachEmail: string;
  sessionDetails: any;
  constructor(private route: ActivatedRoute, private bookingService: BookingService) { }


  ngOnInit() {
    this.coachId = this.route.snapshot.paramMap.get('coachId')!;
    if (this.coachId) {
      this.loadCoachEmailAndSessionDetails();
    } else {
      throw new Error('coachId is null');
    }
  }

  async loadCoachEmailAndSessionDetails() {
    try {
      const coach = await this.bookingService.fetchCoachById(this.coachId);
      this.coachEmail = coach.email;
      const sessions = await this.bookingService.fetchSessionsByCoachEmail(this.coachEmail);
      this.sessionDetails = sessions.find(session => session.coachEmail === this.coachEmail);
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  }

}
