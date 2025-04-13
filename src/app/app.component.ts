// src/app/app.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header>
      <h1>{{ title }}</h1>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <ng-container *ngIf="!currentUser">
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/register" routerLinkActive="active">Register</a>
        </ng-container>
        <ng-container *ngIf="currentUser">
          <a routerLink="/news/add" routerLinkActive="active">Dodaj vijest</a>
          <a routerLink="/my-news" routerLinkActive="active">Moje vijesti</a>
          <a routerLink="/change-password" routerLinkActive="active">Change Password</a>
          <ng-container *ngIf="currentUser.role === 'admin'">
            <a routerLink="/admin" routerLinkActive="active">Admin Panel</a>
          </ng-container>
          <a (click)="logout()" style="cursor:pointer;">Odjavi se</a>
        </ng-container>
      </nav>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- Scroll-to-top dugme -->
    <button class="scroll-top" (click)="scrollToTop()" [class.show]="showScrollButton">
      ↑ Top
    </button>

    <!-- Footer se prikazuje samo kad smo pri dnu stranice -->
    <footer *ngIf="showFooter">
      <p>&copy; 2025 {{ title }}</p>
    </footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'WP_PROJECT_2';
  currentUser: any = null;
  showScrollButton = false;
  showFooter = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('AppComponent: currentUser', user);
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    // Pokaži dugme ako je skrolovanost veća od 200px
    this.showScrollButton = scrollY > 200;

    // Dohvati visinu prozora i visinu dokumenta
    const windowHeight = window.innerHeight;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    // Pokaži footer kad korisnik dođe unutar 50px od dna
    this.showFooter = (windowHeight + scrollY) >= (docHeight - 50);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
