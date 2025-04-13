// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NewsFormComponent } from './news-form/news-form.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminChangePasswordComponent } from './admin-change-password/admin-change-password.component';
import { MyNewsComponent } from './my-news/my-news.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Ruta za promjenu lozinke dostupna svim ulogovanim korisnicima
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'news/add', component: NewsFormComponent },
  { path: 'news/edit/:id', component: NewsFormComponent },
  { path: 'news/:id', component: NewsDetailComponent },
  { path: 'my-news', component: MyNewsComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/change-password/:id', component: AdminChangePasswordComponent }
];
