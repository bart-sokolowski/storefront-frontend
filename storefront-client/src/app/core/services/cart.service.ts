import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items$ = new BehaviorSubject<CartItem[]>([]);

  readonly items = this.items$.asObservable();

  get itemCount(): number {
    return this.items$.getValue().reduce((sum, item) => sum + item.quantity, 0);
  }

  addItem(item: CartItem): void {
    const current = this.items$.getValue();
    const existing = current.find(i => i.productId === item.productId);

    if (existing) {
      existing.quantity += item.quantity;
      this.items$.next([...current]);
    } else {
      this.items$.next([...current, { ...item }]);
    }
  }

  removeItem(productId: string): void {
    this.items$.next(this.items$.getValue().filter(i => i.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const current = this.items$.getValue();
    const item = current.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.items$.next([...current]);
    }
  }

  clear(): void {
    this.items$.next([]);
  }

  getTotal(): number {
    return this.items$.getValue().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }
}
