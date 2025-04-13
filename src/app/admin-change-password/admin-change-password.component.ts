import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.scss']

})
export class AdminChangePasswordComponent implements OnInit {
  userId!: number;
  pwForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
    }
    this.pwForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.pwForm.valid) {
      const { newPassword, confirmPassword } = this.pwForm.value;
      if (newPassword !== confirmPassword) {
        this.errorMessage = 'Lozinke se ne podudaraju.';
        return;
      }
      this.userService.changeUserPasswordAsAdmin(this.userId, newPassword).subscribe({
        next: (res: any) => {
          console.log('Lozinka uspešno promenjena:', res);
          this.router.navigate(['/admin']);
        },
        error: (err: any) => {
          console.error('Greška prilikom promene lozinke:', err);
          this.errorMessage = 'Greška prilikom promene lozinke.';
        }
      });
    }
  }
}
