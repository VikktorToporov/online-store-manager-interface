import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeliveryCompaniesService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/DeliveryCompany';
}