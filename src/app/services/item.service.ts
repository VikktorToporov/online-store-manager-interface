import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/Item';

  getItem(id: string) {
    return this.http.get(`${this.baseUrl}?id=${id}`);
  }

  getLandingItems() {
    return this.http.get(`${this.baseUrl}/Feed`);
  }
}
