import { Component } from '@angular/core';

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

  constructor() {}

  // Method to handle photo selection and show preview
  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result as string; // Set the preview image URL
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  }

  // Method to toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Form submission handler
  submitForm() {
    console.log('Form submitted with:', this.profile, 'Profile Picture:', this.profilePicture);
    // Logic to submit form data (e.g., to a backend API)
  }

  // Skip profile creation
  skipProfile() {
    console.log('Profile creation skipped');
    // Redirect to another page, such as the home screen
  }
}
