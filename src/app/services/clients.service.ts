import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/Client';

  getAll() {
    return this.http.get(`${this.baseUrl}/All`);
  }

  addRemoveFromCart(clientId: string, itemId: string, insert: boolean) {
    const itemsInClientCart = {
      clientId: clientId,
      itemId: itemId,
      insert: insert,
    };

    return this.http.put(`${this.baseUrl}/AddRemoveFromCart`, itemsInClientCart);
  }

  updateClient(payload: any) {
    return this.http.put(`${this.baseUrl}`, payload);
  }

  signup(payload: any) {
    return this.http.post(`${this.baseUrl}`, payload);
  }
}
