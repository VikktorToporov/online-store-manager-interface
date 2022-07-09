import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/User';

  getAll() {
    return this.http.get(`${this.baseUrl}/All`);
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}?id=${id}`);
  }

  updateUser(payload: any) {
    return this.http.put(`${this.baseUrl}`, payload);
  }

  login(payload: any) {
    return this.http.put(`${this.baseUrl}/Auth`, payload);
  }

  signup(payload: any) {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  changeTheme(payload: any) {
    return this.http.put(`${this.baseUrl}/ChangeTheme?userId=${payload?.userId}&theme=${payload?.theme}`, null);
  }
}
