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
  errorMessage: string | null = null;

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
      this.errorMessage = 'Complete all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const user = await this.authService.registerUser(this.profile.email, this.profile.password, this.profile.fullName);
      console.log('User created:', user);

      if (user && user.uid) {
        const profileData = {
          name: this.profile.fullName,
          email: this.profile.email,
          nickname: this.profile.nickname,
          phoneNumber: this.profile.phoneNumber,
          profilePicture: this.profilePicture || undefined
        };

        await this.authService.saveUserProfile(user.uid, profileData);
        console.log('User profile saved:', profileData);
      }

      this.router.navigate(['/role']);
    } catch (error) {
      if ((error as any).code === 'auth/email-already-in-use') {
        this.errorMessage = 'The email address is already in use by another account.';
      } else if ((error as any).code === 'permission-denied') {
        this.errorMessage = 'Missing or insufficient permissions. Please check your Firestore rules.';
      } else {
        this.errorMessage = 'Error creating user: ' + (error as any).message;
      }
      console.error('Error creating user:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
