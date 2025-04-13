import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { UserService } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  pendingNews: any[] = [];
  users: any[] = [];

  constructor(
    private newsService: NewsService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPendingNews();
    this.loadUsers();
  }

  loadPendingNews(): void {
    this.newsService.getPendingNews().subscribe({
      next: (data: any) => {
        console.log("Loaded pending news:", data);
        this.pendingNews = data;
      },
      error: (err: any) => {
        console.error("Error loading pending news:", err);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        console.log("Loaded users:", data);
        this.users = data;
      },
      error: (err: any) => {
        console.error("Error loading users:", err);
      }
    });
  }

  approveNews(id: number): void {
    this.newsService.approveNews(id).subscribe({
      next: (res: any) => {
        console.log("News approved:", res);
        this.loadPendingNews();
      },
      error: (err: any) => {
        console.error("Error approving news:", err);
      }
    });
  }

  deleteNews(id: number): void {
    this.newsService.deleteNews(id).subscribe({
      next: (res: any) => {
        console.log("News deleted:", res);
        this.loadPendingNews();
      },
      error: (err: any) => {
        console.error("Error deleting news:", err);
      }
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: (res: any) => {
        console.log("User deleted:", res);
        this.loadUsers();
      },
      error: (err: any) => {
        console.error("Error deleting user:", err);
      }
    });
  }

  changeUserPassword(id: number): void {
    this.router.navigate([`/admin/change-password/${id}`]);
  }

  addNews(): void {
    this.router.navigate(['/news/add']);
  }
}
