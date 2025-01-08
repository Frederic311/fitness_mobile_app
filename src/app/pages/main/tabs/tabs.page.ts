import { Component, OnInit } from '@angular/core';
import { AuthService, Session, Users } from '../../../services/auth/auth-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(    private router: Router,    private authService: AuthService,

  ) { }

  ngOnInit() {
  }
  signOut(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
