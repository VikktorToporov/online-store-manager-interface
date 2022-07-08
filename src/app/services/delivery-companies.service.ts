import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeliveryCompaniesService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/DeliveryCompany';

  getDeliveryCompanies() {
    return this.http.get(`${this.baseUrl}/All`);
  }

  updateDeliveryCompanies(payload: any) {
    return this.http.put(`${this.baseUrl}`, payload);
  }

  deleteCompanies(id: string) {
    return this.http.delete(`${this.baseUrl}?id=${id}`);
  }
}
