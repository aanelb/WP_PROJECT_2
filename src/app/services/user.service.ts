import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost/WP_PROJECT_2_API';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUsers.php`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUser.php?id=${id}`);
  }

  changeUserPasswordAsAdmin(userId: number, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin-change-password.php`, { userId, newPassword });
  }
}
