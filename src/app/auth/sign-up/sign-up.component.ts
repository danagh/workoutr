import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ConfirmPasswordValidator } from '../confirm-password.validator';
import { getErrorMessage, getWorkoutTypes } from '../../helpers/formHelpers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordVerification: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', [Validators.required]],
      interests: ['', [Validators.required]]
    },
    {
      validator: ConfirmPasswordValidator('password', 'passwordVerification')
    }
  );

  typeList = getWorkoutTypes();
  isCreating: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  get interests() {
    return this.signUpForm.controls['interests'] as FormControl<any>;
  }

  onSubmit(event: any) {
    event.preventDefault();

    if (!this.signUpForm.valid) {
      return;
    }

    this.isCreating = true;
    this.errorMessage = '';

    const { email, password, name, interests } = this.signUpForm.value;

    this.authService.signUp(email, password, name, interests)
      .then(() => {
        this.router.navigate(['auth', 'verify-email']);
      })
      .catch(err => {
        this.isCreating = false;
        this.errorMessage = err.message;
      });
  }

  getErrorMessage(control: AbstractControl<any, any>): string {
    return getErrorMessage(control);
  }
}
