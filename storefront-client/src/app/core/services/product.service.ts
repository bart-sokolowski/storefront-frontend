import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.model';
import { Product, CreateProductRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/products`;

  getAll() {
    return this.http.get<ApiResult<Product[]>>(this.baseUrl);
  }

  create(request: CreateProductRequest) {
    return this.http.post<ApiResult<Product>>(this.baseUrl, request);
  }

  delete(id: string) {
    return this.http.delete<ApiResult<void>>(`${this.baseUrl}/${id}`);
  }
}
