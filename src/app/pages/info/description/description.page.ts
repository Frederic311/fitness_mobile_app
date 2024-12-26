import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})
export class DescriptionPage {
  ageOptions = Array.from({ length: 100 }, (_, i) => i + 1); // 1 to 100
  heightOptions = Array.from({ length: 121 }, (_, i) => 100 + i); // 100 to 220
  weightOptions = Array.from({ length: 101 }, (_, i) => 40 + i); // 40 to 140

  selectedAge: number | null = null;
  selectedHeight: number | null = null;
  selectedWeight: number | null = null;

  constructor(private router: Router) {}

  // Select values
  selectAge(age: number): void {
    this.selectedAge = age;
  }

  selectHeight(height: number): void {
    this.selectedHeight = height;
  }

  selectWeight(weight: number): void {
    this.selectedWeight = weight;
  }

  // Scroll through options
  scrollLeft(): void {
    const container = document.querySelector('.carousel-items') as HTMLElement;
    if (container) container.scrollLeft -= 100;
  }

  scrollRight(): void {
    const container = document.querySelector('.carousel-items') as HTMLElement;
    if (container) container.scrollLeft += 100;
  }

  // Navigate back to Role page
  goBack(): void {
    this.router.navigate(['/role']);
  }

  // Submit details and complete the process
  submitDetails(): void {
    if (this.selectedAge && this.selectedHeight && this.selectedWeight) {
      console.log({
        age: this.selectedAge,
        height: this.selectedHeight,
        weight: this.selectedWeight,
      });
      this.router.navigate(['/home']); // Navigate to the next page
    } else {
      console.error('Complete all fields before continuing.');
    }
  }
}
