import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const currentUser = this.authService.getCurrentUser(); 
    if (currentUser && currentUser.role === 'admin') {
      return true;
    } else {
      // Ako korisnik nije admin, preusmeri na /login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
