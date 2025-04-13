import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../services/news.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss']
})
export class NewsFormComponent implements OnInit {
  newsForm!: FormGroup;
  isEditMode = false;
  newsId!: string | null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Koristimo kontrolu "datetime" za unos datuma i vremena
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      datetime: ['', Validators.required]
    });

    this.newsId = this.route.snapshot.paramMap.get('id');
    if (this.newsId) {
      this.isEditMode = true;
      this.newsService.getNewsById(this.newsId).subscribe({
        next: (res) => {
          let datetimeLocal = '';
          if (res.date) {
            const parts = res.date.split(' ');
            if (parts.length === 2) {
              const datePart = parts[0];
              const timeParts = parts[1].split(':');
              if (timeParts.length >= 2) {
                datetimeLocal = `${datePart}T${timeParts[0]}:${timeParts[1]}`;
              }
            }
          }
          this.newsForm.patchValue({
            title: res.title,
            content: res.content,
            datetime: datetimeLocal
          });
        },
        error: (err) => {
          console.error('Greška pri učitavanju vijesti', err);
          this.errorMessage = 'Neuspelo učitavanje vijesti.';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.newsForm.valid) {
      let newsData = { ...this.newsForm.value };
      // Transformiši datetime u format "YYYY-MM-DD HH:MM:00"
      if (newsData.datetime) {
        newsData.date = newsData.datetime.replace('T', ' ') + ":00";
      }
      delete newsData.datetime;
      const currentUser = this.authService.currentUserValue;
      newsData.authorId = currentUser ? currentUser.id : 0;
      if (currentUser && currentUser.role === 'admin') {
        newsData.isAdmin = true;
      }

      console.log('Podaci koje šaljem:', newsData);

      if (this.isEditMode && this.newsId) {
        this.newsService.updateNews(this.newsId, newsData).subscribe({
          next: (res) => {
            console.log('Vijest ažurirana:', res);
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Greška pri ažuriranju vijesti', err);
            this.errorMessage = 'Nije moguće ažurirati vijest.';
          }
        });
      } else {
        this.newsService.addNews(newsData).subscribe({
          next: (res) => {
            console.log('Vijest dodana:', res);
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Greška pri dodavanju vijesti', err);
            this.errorMessage = 'Nije moguće dodati vijest.';
          }
        });
      }
    }
  }
}
