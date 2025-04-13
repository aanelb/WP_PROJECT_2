import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../services/news.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Dodaj


@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  news: any;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private newsService: NewsService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.newsService.getNewsById(id).subscribe({
        next: (data) => this.news = data,
        error: (err) => this.errorMessage = 'Greška prilikom učitavanja vijesti.'
      });
    }
  }
}
