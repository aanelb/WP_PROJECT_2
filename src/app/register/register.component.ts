// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  showSuccessMessage: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // Validator koji proverava da li nova lozinka i potvrda lozinke odgovaraju jedno drugom
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          console.log('Registration successful:', res);
          this.successMessage = 'Uspješna registracija!';
          this.showSuccessMessage = true;
          this.registerForm.reset();
          // Sakrij poruku nakon 3 sekunde
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        },
        error: (err) => {
          console.error('Greška pri registraciji:', err);
          this.errorMessage = 'Registracija nije uspjela.';
        }
      });
    }
  }
}
