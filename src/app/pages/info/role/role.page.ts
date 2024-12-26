import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.page.html',
  styleUrls: ['./role.page.scss'],
})
export class RolePage {
  selectedRole: string | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  // Select a role
  selectRole(role: string): void {
    this.selectedRole = role;
  }

  // Proceed to the Description page
  async continue(): Promise<void> {
    if (this.selectedRole) {
      try {
        const user = await this.authService.getProfile();
        if (user && user.uid) {
          await this.authService.updateUserRole(user.uid, this.selectedRole);
          console.log('Selected Role:', this.selectedRole);
          this.router.navigate(['/description']); // Navigate to the Description page
        } else {
          this.errorMessage = 'User not found. Please log in again.';
        }
      } catch (error) {
        this.errorMessage = 'Error updating role: ' + ((error as any).message || error);
        console.error('Error updating role:', error);
      }
    } else {
      this.errorMessage = 'Select a role to continue.';
    }
  }
}
