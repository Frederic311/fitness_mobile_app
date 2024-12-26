import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.page.html',
  styleUrls: ['./role.page.scss'],
})
export class RolePage {
  selectedRole: string | null = null;

  constructor(private router: Router) {}

  // Select a role
  selectRole(role: string): void {
    this.selectedRole = role;
  }

  // Proceed to the Description page
  continue(): void {
    if (this.selectedRole) {
      console.log('Selected Role:', this.selectedRole);
      this.router.navigate(['/description']); // Navigate to the Description page
    } else {
      console.error('Select a role to continue.');
    }
  }
}
