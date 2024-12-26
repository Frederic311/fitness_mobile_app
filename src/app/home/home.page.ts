import { Component, OnInit } from '@angular/core';
import { AuthService, Users } from '../services/auth/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: Users | null = null;
  profilePicture: string | null = null;
  bannerImage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getProfile().then(user => {
      if (user && user.uid) {
        this.authService.fetchUserProfile(user.uid).then(profile => {
          this.user = profile;
          this.profilePicture = profile?.profilePicture || null;
          this.bannerImage = profile?.bannerImage || null;
        }).catch(error => {
          console.error('Error fetching user profile:', error);
        });
      }
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['/landing']);
    });
  }
}
