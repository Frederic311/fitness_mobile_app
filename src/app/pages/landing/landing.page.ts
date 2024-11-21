import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Redirect to login page after 3 seconds
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

}
