import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Session } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.scss'],
})
export class SessionsPage implements OnInit {
  @Input() sessions: Session[];
  @Input() coachEmail: string = ''; // Add coachEmail as input

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    console.log('SessionsPage initialized with sessions:', this.sessions);
    console.log('Coach email:', this.coachEmail);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  // bookSession(session: Session) {
  //   console.log('Booking session:', session);
  //   console.log('Coach email:', this.coachEmail);
  //   // Implement your booking logic here
  // }
}
