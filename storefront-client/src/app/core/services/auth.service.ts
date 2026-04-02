import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.model';
import { UserContextService } from './user-context.service';

interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userContextService = inject(UserContextService);

  private token: string | null = null;
  private readonly isLoggedIn$ = new BehaviorSubject<boolean>(false);

  readonly isLoggedIn = this.isLoggedIn$.asObservable();

  login(email: string, password: string) {
    return this.http.post<ApiResult<AuthResponse>>(
      `${environment.apiUrl}/api/auth/login`,
      { email, password }
    ).pipe(
      tap(result => {
        if (result.isSuccess && result.data?.token) {
          this.token = result.data.token;
          this.isLoggedIn$.next(true);
          this.userContextService.setFromToken(result.data.token);
        }
      })
    );
  }

  logout() {
    this.token = null;
    this.isLoggedIn$.next(false);
    this.userContextService.clear();
  }

  getToken(): string | null {
    return this.token;
  }
}
