import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-perso',
  templateUrl: './perso.page.html',
  styleUrls: ['./perso.page.scss'],
})
export class PersoPage {
  profileForm: FormGroup;
  profilePicture: string | null = null;
  showPassword = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      nickname: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (e.g., 2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        this.errorMessage = 'The file size exceeds the 2MB limit. Please choose a smaller file.';
        return;
      }

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
    if (!this.profileForm.valid) {
      this.errorMessage = 'Complete all required fields with valid data';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const formValue = this.profileForm.value;
      const user = await this.authService.registerUser(formValue.email, formValue.password, formValue.fullName);
      console.log('User created:', user);

      if (user && user.uid) {
        const profileData = {
          name: formValue.fullName,
          email: formValue.email,
          nickname: formValue.nickname,
          phoneNumber: formValue.phoneNumber,
          profilePicture: this.profilePicture || undefined
        };

        await this.authService.saveUserProfile(user.uid, profileData);
        console.log('User profile saved:', profileData);
        this.router.navigate(['/role']);
      }
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
