import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading = false;
  error = '';
  hidepassword = true;

  // build the reactive form
    form: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private auth: AuthService,
      private router: Router
    ) {
      // initialize the form after fb is assigned
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        remember: [false]
      });
    }

  // typed accessor for form controls
  get f() {
    return this.form.controls;
  }

  login(): void {
    // clear previous error
    this.error = '';

    if (this.form.invalid) {
      // mark controls touched so errors appear
      this.form.markAllAsTouched();
      this.error = 'Please fill in the required fields.';
      return;
    }

    const { email, password, remember } = this.form.value as {
      email: string;
      password: string;
      remember: boolean;
    };

    this.loading = true;

    this.auth.login(email.trim(), password).subscribe({
      next: () => {
        // optionally use `remember` to change storage strategy in AuthService
        // e.g. this.auth.setRemember(remember);
        this.loading = false;
        // navigate to return URL or dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error', err);
        this.loading = false;
        this.error = err?.error?.message || 'Invalid email or password';
      }
    });
  }
}
