import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
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

  profilePicture: string | null = null; // Holds the preview image URL
  showPassword = false;

  constructor(private router: Router) {}

  // Method to handle photo selection and preview
  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result as string; // Set preview image URL
      };
      reader.readAsDataURL(file); // Read the file as Data URL
    }
  }

  // Method to programmatically trigger the file input
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  // Method to toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Form submission handler
  submitForm() {
    // console.log('Form submitted with:', this.profile, 'Profile Picture:', this.profilePicture);
    this.router.navigate(['/role'])
    console.log('Profile creation skipped');
    // Submit form data (e.g., to a backend API)
  }

  // Skip profile creation
  skipProfile() {
    console.log('Profile creation skipped');
    // Redirect to another page (e.g., the home screen)
  }
}
