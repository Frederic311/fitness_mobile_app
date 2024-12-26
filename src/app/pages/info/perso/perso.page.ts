import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-perso',
  templateUrl: './perso.page.html',
  styleUrls: ['./perso.page.scss'],
})
export class PersoPage {
  profile = {
    fullName: '',
    nickname: '',
    email: '',
    password: '',
    phoneNumber: '',
  };

  profilePicture: string | null = null;
  showPassword = false;
  isLoading = false;

  constructor(private router: Router, private authService: AuthService) {}

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async submitForm(): Promise<void> {
    if (!this.profile.email || !this.profile.password || !this.profile.fullName) {
      console.error('Complete all required fields');
      return;
    }

    this.isLoading = true;

    try {
      const user = await this.authService.registerUser(this.profile.email, this.profile.password);
      console.log('User created:', user);

      // Optionally, save additional profile info to Firestore or Realtime Database
      this.router.navigate(['/role']); // Navigate to Role Page
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
