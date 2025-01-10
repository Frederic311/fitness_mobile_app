import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, Session, Users } from '../../../services/auth/auth-service.service';
import { BookingService } from '../../../services/booking/booking.service';
import { Router } from '@angular/router';
import { Pedometer, IPedometerData } from '@ionic-native/pedometer/ngx';
import { Platform } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SessionsPage } from '../sessions/sessions.page';



@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
  styleUrls: ['./main-user.page.scss'],
})
export class MainUserPage implements OnInit, OnDestroy {
  user: Users | null = null;
  sessions: Session[] = [];
  coaches: Users[] = [];
  totalDistance: number = 0;
  totalDuration: number = 0;
  steps: number = 0;
  distance: number = 0;
  startTime: number = 0;
  sessionDuration: number = 0;
  acceptedReservations: any[] = [];

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router,
    private pedometer: Pedometer,
    private platform: Platform,
    private diagnostic: Diagnostic,
    private androidPermissions: AndroidPermissions,
    private cd: ChangeDetectorRef, // Add this line
    private modalController: ModalController,

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

    this.platform.ready().then(() => {
      this.requestPedometerPermission();
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
        this.loadSessions(this.user.email); // Reload sessions after booking
      } catch (error) {
        console.error('Error booking session:', error);
        this.presentToast('Error booking session. Please try again.');
      }
    } else {
      this.presentToast('User information is missing. Please log in again.');
    }
  }
  async loadSessionsByCoachEmail(coachEmail: string) {
    try {
      this.sessions = await this.bookingService.fetchSessionsByCoachEmail(coachEmail);
    } catch (error) {
      console.error('Error fetching sessions by coach email:', error);
    }
  }

  async openSessionsModal(coachEmail: string) { await this.loadSessionsByCoachEmail(coachEmail); // Load sessions by coach email
  const modal = await this.modalController.create({ component: SessionsPage, componentProps: { sessions: this.sessions,coachEmail: coachEmail  } });
  return await modal.present();}

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

  requestPedometerPermission() {
    if (this.platform.is('android')) {

      this.diagnostic.requestRuntimePermission(this.diagnostic.permission.BODY_SENSORS)
        .then((status) => {
          if (status === this.diagnostic.permissionStatus.GRANTED) {
            this.startPedometer();
          } else {
            console.error('Permission for BODY_SENSORS not granted');
          }
        }).catch((error) => {
          console.error('Error requesting BODY_SENSORS permission:', error);
        });
    } else {
      this.startPedometer();
    }
  }

  startPedometer() {
    this.startTime = Date.now();
    const stepLengthInMeters = 0.762; // Average step length in meters, adjust as needed

    this.pedometer.startPedometerUpdates()
      .subscribe((data: IPedometerData) => {
        this.steps = data.numberOfSteps;
        this.distance = this.steps * stepLengthInMeters / 1000; // Distance in kilometers
        this.sessionDuration = (Date.now() - this.startTime) / (1000 * 60 * 60); // Duration in hours
        this.totalDuration += this.sessionDuration;
        this.startTime = Date.now(); // Reset start time for next session

        // Trigger change detection
        this.cd.detectChanges();
      }, (error) => {
        console.error('Error with pedometer updates:', error);
      });
  }




  ngOnDestroy() {
    this.pedometer.stopPedometerUpdates();
  }
}
