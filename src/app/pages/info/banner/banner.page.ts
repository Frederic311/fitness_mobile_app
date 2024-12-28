import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.page.html',
  styleUrls: ['./banner.page.scss'],
})
export class BannerPage {
  bannerImage: string | null = null;
  description: string = '';
  sessionPrice: number | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  onBannerSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.bannerImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  async submitBannerDetails(): Promise<void> {
    if (this.bannerImage && this.description && this.sessionPrice) {
      try {
        const user = await this.authService.getProfile();
        if (user && user.uid) {
          await this.authService.updateUserDetails(user.uid, {
            bannerImage: this.bannerImage,
            description: this.description,
            sessionPrice: this.sessionPrice
          });
          console.log('Banner details saved:', {
            bannerImage: this.bannerImage,
            description: this.description,
            sessionPrice: this.sessionPrice,
          });
          this.router.navigate(['/main-coach']); // Navigate to the home page
        } else {
          this.errorMessage = 'User not found. Please log in again.';
        }
      } catch (error) {
        this.errorMessage = 'Error saving banner details: ' + ((error as Error).message || error);
        console.error('Error saving banner details:', error);
      }
    } else {
      this.errorMessage = 'Complete all fields before continuing.';
    }
  }
}
