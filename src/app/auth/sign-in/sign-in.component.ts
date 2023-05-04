import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  isLoggingIn: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  onSubmit(event: any) {
    event.preventDefault();

    if (!this.signInForm.valid) {
      return;
    }

    this.isLoggingIn = true;
    this.errorMessage = '';

    this.authService.signIn(this.signInForm.value.email!, this.signInForm.value.password!)
      .then(user => {
        if (!user || !user.emailVerified) {
          this.isLoggingIn = false;
          this.errorMessage = 'Du måste verifiera din mail innan du kan logga in';
          return;
        }

        this.authService.handleSignIn(user)
          .then(signedIn => {
            if (!signedIn) {
              this.isLoggingIn = false;
              this.errorMessage = 'Användaren hittades inte';
              return;
            }

            this.router.navigate(['dashboard']);
          })
      })
      .catch(err => {
        this.isLoggingIn = false;
        this.errorMessage = err.message;
      });
  }
}
