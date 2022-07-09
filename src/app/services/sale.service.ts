import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/Sale';

  getAll() {
    return this.http.get(`${this.baseUrl}/All`);
  }

  updateSale(payload: any) {
    return this.http.put(`${this.baseUrl}`, payload);
  }

  addSale(payload: any) {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  deleteSales(id: string) {
    return this.http.put(`${this.baseUrl}/Delete?id=${id}`, null);
  }
}
