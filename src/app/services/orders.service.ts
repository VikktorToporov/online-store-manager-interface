import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/Order';

  insertOrder(payload: any) {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  getbyClient(id: string) {
    return this.http.get(`${this.baseUrl}/Client?clientId=${id}`);
  }
}
