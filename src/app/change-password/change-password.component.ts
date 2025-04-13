// src/app/change-password/change-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Uzmi trenutno ulogovanog korisnika iz AuthService
    this.currentUser = this.authService.currentUserValue;
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // Validator koji proverava da li se nova lozinka poklapa s potvrdom
  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const payload = {
        username: this.currentUser ? this.currentUser.username : null,
        currentPassword: this.changePasswordForm.get('currentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value
      };

      this.authService.changePassword(payload).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.successMessage = 'Lozinka je uspješno promijenjena.';
            this.errorMessage = '';
            this.changePasswordForm.reset();
          } else {
            this.errorMessage = res.message || 'Promjena lozinke nije uspjela.';
            this.successMessage = '';
          }
        },
        error: (err: any) => {
          console.error('Error changing password:', err);
          this.errorMessage = 'Došlo je do greške. Pokušajte ponovo.';
          this.successMessage = '';
        }
      });
    }
  }
}
