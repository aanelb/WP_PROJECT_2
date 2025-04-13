// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('LoginComponent initialized');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          console.log('Logged in:', res);
          if (res.status === 'success') {
            // Postavi korisnika u AuthService (BehaviorSubject)
            this.authService.setCurrentUser(res.user);
            // Preusmjeri korisnika prema ulozi
            if (res.user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.errorMessage = 'Neispravno korisničko ime ili lozinka.';
          }
        },
        error: (err: any) => {
          console.error('Login error:', err);
          this.errorMessage = 'Neispravno korisničko ime ili lozinka.';
        }
      });
    }
  }
}
