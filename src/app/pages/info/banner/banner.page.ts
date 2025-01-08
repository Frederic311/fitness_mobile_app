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
    if (this.description && this.sessionPrice !== null) {
      try {
        const user = await this.authService.getProfile();
        if (user && user.uid) {
          await this.authService.updateUserDetails(user.uid, {
            bannerImage: this.bannerImage, // This will be null if not provided
            description: this.description,
            sessionPrice: this.sessionPrice
          });
          this.router.navigate(['/main-coach']);
        } else {
          this.errorMessage = 'User not found. Please log in again.';
        }
      } catch (error) {
        this.errorMessage = 'Error saving banner details: ' + ((error as any).message || error);
      }
    } else {
      this.errorMessage = 'Complete all required fields before continuing.';
    }
  }

  goBack(): void {
    this.router.navigate(['/level']);
  }
}
