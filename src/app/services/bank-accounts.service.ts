import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BankAccountsService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/BankAccount';

  getBankAccount(clientId: string) {
    return this.http.get(`${this.baseUrl}?clientId=${clientId}`);
  }

  updateBankAccount(payload: any) {
    return this.http.put(`${this.baseUrl}`, payload);
  }

  insertBankAccount(payload: any) {
    return this.http.post(`${this.baseUrl}`, payload);
  }
}
