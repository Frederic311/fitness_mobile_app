import { Component, OnInit } from '@angular/core';
import { AuthService, Users } from '../../../services/auth/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
  styleUrls: ['./main-user.page.scss'],
})
export class MainUserPage implements OnInit {
  user: Users | null = null;
  coaches: Users[] = [];
  totalDistance: number = 0;
  totalDuration: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

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
  

  bookSession(coachId: string): void {
    // Implement booking logic here
    console.log(`Booking session with coach ID: ${coachId}`);
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['/landing']);
    });
  }
}
