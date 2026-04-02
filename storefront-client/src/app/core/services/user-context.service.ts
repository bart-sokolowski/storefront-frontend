import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserContext } from '../models/user-context.model';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private readonly context$ = new BehaviorSubject<UserContext | null>(null);

  readonly userContext = this.context$.asObservable();

  setFromToken(token: string): void {
    const payload = this.decodeToken(token);
    if (!payload) return;

    const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? '';
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? 'User';
    const isAdmin = role === 'Admin';

    this.context$.next({
      email,
      role,
      isAdmin,
      permissions: {
        canCreateProduct: isAdmin,
        canDeleteProduct: isAdmin,
        canViewOrders: true,
        canPlaceOrder: true
      }
    });
  }

  clear(): void {
    this.context$.next(null);
  }

  getContext(): UserContext | null {
    return this.context$.getValue();
  }

  private decodeToken(token: string): Record<string, string> | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}
