import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/Store';

  getAll() {
    return this.http.get(`${this.baseUrl}/All`);
  }

  getByUserId(id: string) {
    return this.http.get(`${this.baseUrl}/User?userId=${id}`);
  }

  updateStore(payload: any) {
    return this.http.put(`${this.baseUrl}`, payload);
  }

  addStore(payload: any) {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  deleteStore(id: string) {
    return this.http.delete(`${this.baseUrl}?id=${id}`);
  }
}
