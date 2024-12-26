import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Users } from '../../services/auth/auth-service.service';

@Component({
  selector: 'app-level',
  templateUrl: './level.page.html',
  styleUrls: ['./level.page.scss'],
})
export class LevelPage implements OnInit {
  sportsLevels = ['Débutant', 'Intermédiaire', 'Expert'];
  selectedSportsLevel: string | null = null;

  sportsOptions = [
    'Gymnastique',
    'Taekwondo',
    'Karate',
    'Bodybuilding',
    'Natation',
    'Course',
  ];
  selectedSportsCriteria: string[] = [];

  errorMessage: string | null = null;
  userRole: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().then(user => {
      if (user && user.uid) {
        this.authService.fetchUserProfile(user.uid).then(profile => {
          this.userRole = profile?.role || null;
        }).catch(error => {
          console.error('Error fetching user profile:', error);
        });
      }
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }

  // Select sports level
  selectSportsLevel(level: string): void {
    this.selectedSportsLevel = level;
  }

  // Toggle sport criteria selection
  toggleSportSelection(sport: string): void {
    const index = this.selectedSportsCriteria.indexOf(sport);
    if (index > -1) {
      this.selectedSportsCriteria.splice(index, 1);
    } else {
      this.selectedSportsCriteria.push(sport);
    }
  }

  // Navigate back
  goBack(): void {
    this.router.navigate(['/description']);
  }

  // Submit sports level and criteria
  async submitSportsDetails(): Promise<void> {
    if (this.selectedSportsLevel && this.selectedSportsCriteria.length > 0) {
      try {
        const user = await this.authService.getProfile();
        if (user && user.uid) {
          await this.authService.updateUserDetails(user.uid, {
            sportsLevel: this.selectedSportsLevel,
            sportsCriteria: this.selectedSportsCriteria
          });
          console.log('Sports details saved:', {
            sportsLevel: this.selectedSportsLevel,
            sportsCriteria: this.selectedSportsCriteria,
          });

          if (this.userRole === 'Coach') {
            this.router.navigate(['/banner']); // Navigate to the Banner page
          } else {
            this.router.navigate(['/home']); // Navigate to the Home page
          }
        } else {
          this.errorMessage = 'User not found. Please log in again.';
        }
      } catch (error) {
        if (error instanceof Error) {
          this.errorMessage = 'Error saving sports details: ' + error.message;
        } else {
          this.errorMessage = 'Error saving sports details: ' + error;
        }
        console.error('Error saving sports details:', error);
      }
    } else {
      this.errorMessage = 'Complete all fields before continuing.';
    }
  }
}
