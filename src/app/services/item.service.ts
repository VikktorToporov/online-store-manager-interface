import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SortColumn, SortOrder } from '../enums/sort.enum';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8080/api/Item';

  getAll(params: any) {
    let urlParams = '';
    let method = 'All';

    urlParams += params.skip != null ? `?skip=${params.skip}` : 0;
    urlParams += params.top != null ? `&top=${params.top}` : 10;
    urlParams += params.sortOrder != null ? `&sortOrder=${params?.sortOrder}` : SortOrder[SortOrder.ASC];
    urlParams += params.sortColumn != null ? `&sortColumn=${params?.sortColumn}` : SortColumn[SortColumn.CREATEDATE];

    if (params.storeId) {
      urlParams += `&storeId=${params.storeId}`;
      method = 'Store';
    }
    

    if (params) {
      if (params.searchKeyword != null) {
        urlParams += `&searchKeyword=${params?.searchKeyword}`;
      }

      if (params.priceFrom != null) {
        urlParams += `&priceFrom=${params?.priceFrom}`;
      }

      if (params.priceTo != null) {
        urlParams += `&priceTo=${params?.priceTo}`;
      }

      if (params.category != null) {
        urlParams += `&category=${params?.category}`;
      }
    }

    return this.http.get(`${this.baseUrl}/${method}${urlParams}`);
  }

  getItem(id: string) {
    return this.http.get(`${this.baseUrl}?id=${id}`);
  }

  getLandingItems(id: string) {
    let param = '';

    if (id) {
      param = `?clientId=${id}`;
    }

    return this.http.get(`${this.baseUrl}/Feed${param}`);
  }

  getItemsByIds(ids: string[]) {
    const params = '?ids=' + ids?.join('&ids=');

    return this.http.get(`${this.baseUrl}/Ids${params}`);
  }

  updateItem(payload: any) {
    return this.http.put(`${this.baseUrl}`, payload);
  }

  addItem(payload: any) {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  deleteItem(id: string) {
    return this.http.put(`${this.baseUrl}/Delete?id=${id}`, null);
  }
}
