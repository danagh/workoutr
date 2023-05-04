import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User } from './types/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'workoutr';
  user: User | null;

  constructor(public authService: AuthService) {
    this.user = this.authService.loggedInUser;
  }

  signOut() {
    this.authService.signOut();
  }
}
