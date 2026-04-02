import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.model';
import { Order, CreateOrderRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/orders`;

  getAll() {
    return this.http.get<ApiResult<Order[]>>(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get<ApiResult<Order>>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateOrderRequest) {
    const idempotencyKey = crypto.randomUUID();
    const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });
    return this.http.post<ApiResult<Order>>(this.baseUrl, request, { headers });
  }
}
