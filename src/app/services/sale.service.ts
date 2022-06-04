import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/Sale';
}