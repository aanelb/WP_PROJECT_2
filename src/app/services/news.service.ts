import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://localhost/WP_PROJECT_2_API';

  constructor(private http: HttpClient) {}

  getNews(): Observable<any> {
    // Vraća odobrene vijesti s date <= NOW()
    return this.http.get(`${this.apiUrl}/getNews.php`);
  }

  getFilteredNews(date: string): Observable<any> {
    // Vraća vijesti filtrirane po datumu (filterDate parametar)
    return this.http.get(`${this.apiUrl}/getNews.php?filterDate=${date}`);
  }

  getNewsById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getNews.php?id=${id}`);
  }

  addNews(news: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addNews.php`, news);
  }

  updateNews(id: string, news: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateNews.php?id=${id}`, news);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteNews.php?id=${id}`);
  }

  getPendingNews(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getPendingNews.php`);
  }

  approveNews(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/approveNews.php`, { id });
  }

  getMyNews(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getMyNews.php?id=${userId}`);
  }
}
