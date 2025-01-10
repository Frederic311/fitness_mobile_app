import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Session } from '../../../services/auth/auth-service.service';
import { BookingService } from '../../../services/booking/booking.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.scss'],
})
export class SessionsPage implements OnInit {
  @Input() sessions: Session[];
  @Input() coachEmail: string = '';  // Add coachEmail as input
  @Input() userName: string = '';  // Add userName as input
  @Input() userEmail: string = '';  // Add userEmail as input
  @Input() userProfilePicture: string = '';  // Add userProfilePicture as input

  constructor(
    private modalController: ModalController,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    console.log('SessionsPage initialized with sessions:', this.sessions);
    console.log('Coach email:', this.coachEmail);
    console.log('User name:', this.userName);
    console.log('User email:', this.userEmail);
    console.log('User profile picture:', this.userProfilePicture);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async bookSession(index: number) {
    const session = this.sessions[index];
    console.log('Booking session:', session);
    console.log('User name:', this.userName);  // Log the user's name
    console.log('User email:', this.userEmail);  // Log the user's email
    console.log('User profile picture:', this.userProfilePicture);  // Log the user's profile picture
    console.log('Session goal:', session.goal); // Log the session goal

    if (this.userName && this.userEmail && this.userProfilePicture && session.goal) {
      try {
        await this.bookingService.bookSession(this.coachEmail, this.userName, this.userEmail, this.userProfilePicture, session.goal);
        console.log(`Booking session with coach email: ${this.coachEmail}`);
        this.presentToast('Session booked successfully');
        this.dismissModal();  // Dismiss the modal after an error
      } catch (error) {
        console.error('Error booking session:', error);
        this.presentToast('Error booking session. Please try again.');
      }
    } else {
      this.presentToast('User information is missing. Please log in again.');
      console.error('Missing user information:', {
        name: this.userName,
        email: this.userEmail,
        profilePicture: this.userProfilePicture,
        goal: session.goal
      });
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

  async loadSessions(userEmail: string) {
    try {
      this.sessions = await this.bookingService.fetchSessions(userEmail);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  }
}
