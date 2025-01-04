import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Automatically navigate to workout page after 5 seconds
    // setTimeout(() => {
    //   this.navigateToWorkout();
    // }, 5000);
  }

  navigateToWorkout() {
    this.router.navigate(['/workout1']);
  }
}
