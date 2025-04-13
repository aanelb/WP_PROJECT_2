import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../services/news.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-my-news',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './my-news.component.html',
  styleUrls: ['./my-news.component.scss']
})
export class MyNewsComponent implements OnInit {
  myNews: any[] = [];
  errorMessage = '';

  constructor(
    private newsService: NewsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.loadMyNews(currentUser.id);
    } else {
      this.errorMessage = "You are not logged in.";
    }
  }

  loadMyNews(userId: number): void {
    this.newsService.getMyNews(userId).subscribe({
      next: (data: any) => {
        this.myNews = data;
      },
      error: (err: any) => {
        this.errorMessage = "Failed to load your news.";
        console.error("Error loading my news:", err);
      }
    });
  }

  updateNews(newsId: string): void {
    this.router.navigate(['/news/edit', newsId]);
  }

  deleteNews(newsId: number): void {
    this.newsService.deleteNews(newsId).subscribe({
      next: () => this.loadMyNews(this.authService.currentUserValue.id),
      error: (err: any) => console.error("Error deleting news:", err)
    });
  }
}
